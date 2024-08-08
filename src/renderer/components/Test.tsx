
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Button, Input, Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

export default function Test() {
  const [composits, setComposits] = React.useState([]);
  const [compositInput, setCompositInput] = React.useState('');
  const [currentComposit, setCurrentComposit] = React.useState(null);
  const [addCompositPressed, setAddCompositPressed] = React.useState(false);
  const [renameCompositPressed, setRenameCompositPressed] = React.useState(false);
  const [currentComponent, setCurrentComponent] = React.useState(null);
  const [renameComponentPressed, setRenameComponentPressed] = React.useState(false);
  const [addComponentPressed, setAddComponentPressed] = React.useState(false);
  const [componentInput, setComponentInput] = React.useState('');

  // The old way through send.ipcRenderer/on.ipcMain
  // const handleCompositSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log(data);
  //   window.electron.testRenderer.sendAddComposit({ data });
  // };
  // React.useEffect(() => {
  //   window.electron.testRenderer.onAddComposit((response) => {
  //     // console.log('composits 0 name:', composits[0]?.name);
  //     console.log('composits:', composits);
  //     setComposits([...composits, response.composit]);
  //     console.log(`response from server is: ${JSON.stringify(response)}`);

  //   });
  // }, [composits]);

  // The new way through invoke.ipcRenderer/handle.ipcMain (async)
  // const handleCompositSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log('handleCompositSubmit, data: ', data);
  //   const response = await window.electron.testRenderer.invokeAddComposit({ data });
  //   console.log('handleCompositSubmit, response: ', response);
  //   setComposits([...composits, response.composit]);
  // };

  // The new way through invoke.ipcRenderer/handle.ipcMain (async) and getting input data through state
  const handleCompositSubmit = async () => {
    const response = await window.electron.testRenderer.invokeAddComposit({ data: { compositName: compositInput } });
    console.log('handleCompositSubmit, response: ', response);
    setComposits([...composits, response.composit]);
    setAddCompositPressed(false);
  };

  const handleCompositInputChange = (event) => {
    setCompositInput(event.target.value);
    console.log('handleCompositInputChange, value: ', event.target.value);
  };
  const handleCompositInputSubmit = (event) => {
    handleCompositSubmit();
    console.log('handleCompositInputSubmit, value: ', compositInput);
    // console.log('handleCompositInputSubmit, previous: ', previousCompositInput);
    console.log('handleCompositInputSubmit, state: ', compositInput);
    setCompositInput('');
  };
  const handleCompositInputCancel = (event) => {
    setAddCompositPressed(false);
    setRenameCompositPressed(false);
    setCompositInput('');
  };

  const getComposits = async () => {
    const response = await window.electron.testRenderer.invokeGetComposits();
    console.log('getComposits, response: ', response);
    setComposits(response.composits);
  };

  const deleteComposit = async (compositToDelete) => {
    const response = await window.electron.testRenderer.invokeDeleteComposit({ data: { compositId: compositToDelete?.id } });
    console.log('deleteComposit, response: ', response);
    if (response.isCompositDeleted) {
      const updatedComposits = composits.filter((composit) => composit?.id != compositToDelete?.id);
      setComposits(updatedComposits);
    }
    // else print the error message
  }

  const handleAddComposit = () => {
    setAddCompositPressed(true);
    setRenameCompositPressed(false);
    setCurrentComposit(null);
    setCompositInput('');
  }

  const handleRenameComposit = (composit) => {
    setRenameCompositPressed(true);
    setAddCompositPressed(false);
    setCurrentComposit(composit);
    setCompositInput(composit.name);
  }

  const handleRenameCompositSubmit = async (compositToRename, newCompositName) => {
    const response = await window.electron.testRenderer.invokeRenameComposit({ data: { compositId: compositToRename?.id, newCompositName } });
    console.log('renameComposit, response: ', response);
    if (response.isCompositUpdated) {
      const updatedComposits = composits.map((compositObj) => {
        if (compositObj?.id == compositToRename?.id) {
          compositObj.name = newCompositName;
        }
        return compositObj;
      });
      setComposits(updatedComposits);
    }
    // else give some message that composit wasn't updated
    setCompositInput('');
    setRenameCompositPressed(false);
  }




  const handleComponentInputChange = (event) => {
    setComponentInput(event.target.value);
  };

  const handleComponentInputSubmit = (event) => {
    handleComponentSubmit();
    // setPreviousComponentInput(event.target.value)
    setComponentInput('');
    setAddComponentPressed(false);
    setRenameComponentPressed(false);
  };
  const handleComponentInputCancel = (event) => {
    setComponentInput('');
    setAddComponentPressed(false);
    setRenameComponentPressed(false);
  };

  // old way getting the input through form
  // const handleComponentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log('handleComponentSubmit, data: ', data);
  //   const response = await window.electron.testRenderer.invokeAddComponent({ data: {component: 'test', composit: 'comp' }});
  //   console.log('handleComponentSubmit, response: ', response);
  //   // setComposits([...composits, response.composit]);
  // };

  // new way get the input through state
  const handleComponentSubmit = async () => {
    console.log('handleComponentSubmit, componentInput: ', componentInput);
    // console.log('handleComponentSubmit, previousCompositInput: ', previousCompositInput);
    const response = await window.electron.testRenderer.invokeAddComponent({ data: { componentName: componentInput, compositId: currentComposit?.id } });
    // console.log('handleComponentSubmit, response: ', response);
    const compositsUpdated = composits.map((composit) => {
      if (composit?.id == currentComposit?.id) {
        composit.components?.push(response.component)
      }
      return composit;
    })
    console.log('handleComponentSubmit, compositsUpdated: ', compositsUpdated);
    setComposits(compositsUpdated);
  };

  const handleAddComponent = async (currentCompositObj) => {
    console.log('handleAddComponent called, currentCompositName: ', currentCompositObj);
    console.log('handleAddComponent called, currentComposit: ', currentComposit);
    console.log('handleAddComponent called, addComponentPressed: ', addComponentPressed);
    setCurrentComposit(currentCompositObj);
    setRenameComponentPressed(false);
    setComponentInput('');
    setAddComponentPressed(true);
  };

  const deleteComponent = async (composit, component) => {
    const response = await window.electron.testRenderer.invokeDeleteComponent({ data: { componentId: component?.id } });
    // console.log('deleteComponent, response: ', response);
    const updatedComposits = composits.map((compositObj) => {
      if (compositObj?.id == composit?.id) {
        // console.log('deleteComponent, composit: ', composit)
        // composit.components = composit.components?.filter((component) => component?.name != componentName);
        compositObj.components = compositObj.components?.filter((componentObj) => {
          return deleteComponentRecurive(componentObj, component?.id)
        });
        console.log('deleteComponent, composit: ', compositObj);
      }
      return compositObj;
    })
    console.log('deleteComponent, updatedComposits: ', updatedComposits);
    setComposits(updatedComposits);
  }

  // const deleteComponentRecurive = (componentObj, componentName) => {
  //   console.log('deleteComponentRecurive, componentObj: ', componentObj);
  //   console.log('deleteComponentRecurive, componentName: ', componentName);

  //   if (componentObj.subcomponents?.length > 0){
  //     componentObj.subcomponents.filter((component) => {
  //       const res = deleteComponentRecurive(component, componentName);
  //       console.log('deleteComponent, res: ', res);

  //     })
  //   }else {
  //     return componentObj;
  //   }

  //   if (componentObj.name == componentName) {
  //     console.log('deleteComponentRecurive, componentObj == componentName');
  //     return false;
  //   }else{
  //     return componentObj;
  //   }
  // }

  const deleteComponentRecurive = (componentObj, componentId) => {
    console.log('deleteComponentRecurive, componentObj: ', componentObj);
    console.log('deleteComponentRecurive, componentName: ', componentId);

    if (componentObj.subcomponents?.length > 0) {
      componentObj.subcomponents = componentObj.subcomponents.filter((subComponent) => {
        return deleteComponentRecurive(subComponent, componentId);
      })

    }
    console.log('componentObj: ', componentObj);

    if (componentObj?.id == componentId) {
      console.log('deleteComponentRecurive, componentObj == componentName');
      return false;
    }

    // console.log('deleteComponentRecurive, componentObj: ', componentObj);
    return componentObj;
  }
//  --------------------------------------------
  const handleRenameComponent = (component) => {
    console.log("handleRenameComponent called, component: ", component)
    setAddComponentPressed(false);
    setRenameComponentPressed(true);
    setCurrentComponent(component);
    setComponentInput(component.name);
  }

  const handleRenameComponentSubmit = async (composit, componentToRename, newComponentName) => {
    const response = await window.electron.testRenderer.invokeRenameComponent({ data: { componentId: componentToRename?.id, newComponentName } });
    console.log('handleRenameComponentSubmit, response: ', response);
    if (response.isComponentUpdated) {
      const updatedComposits = composits.map((compositObj) => {


        if (compositObj?.name == composit?.name) {
          compositObj.components = composit.components?.map((componentObj) => {
            return renameComponentRecurive(componentObj, componentToRename, newComponentName)
          });
          console.log('handleRenameComponentSubmit, composit: ', composit);
        }
        return compositObj;
      });
      setComposits(updatedComposits);
    }// else give some message that composit wasn't updated

    setComponentInput('');
    setRenameComponentPressed(false);
  }

  const renameComponentRecurive = (componentObj, componentToRename, newComponentName) => {
    console.log('renameComponentRecurive, componentObj: ', componentObj);
    console.log('renameComponentRecurive, componentName: ', newComponentName);

    if (componentObj.subcomponents?.length > 0) {
      componentObj.subcomponents = componentObj.subcomponents.map((subComponent) => {
        return renameComponentRecurive(subComponent, componentToRename, newComponentName);
      })
    }
    console.log('componentObj: ', componentObj);

    if (componentObj.id == componentToRename.id) {
      componentObj.name = newComponentName
      console.log('renameComponentRecurive, componentObj.id == componentToRename.i');
    }

    return componentObj;
  }



  const handleSubComponentSubmit = async (selectedComposit, selectedComponent, subComponentInput) => {
    console.log('handleSubComponentSubmit, subComponentInput: ', subComponentInput);
    // console.log('handleSubComponentSubmit, previousCompositInput: ', previousCompositInput);
    const response = await window.electron.testRenderer.invokeAddSubComponent({ data: { subComponentName: subComponentInput, componentId: selectedComponent?.id, compositId: selectedComposit?.id } });
    console.log('handleSubComponentSubmit, response: ', response);
    const compositsUpdated = composits.map((compositObj) => {
      console.log('handleSubComponentSubmit, compositObj: ', compositObj);

      if (compositObj.id == selectedComposit.id) {
        compositObj.components = compositObj.components?.map((componentObj) => {
          return updateComponentWithNewSubcomponent(componentObj, selectedComponent, response.subComponent)
        })

      }
      return compositObj;
    })
    console.log('handleComponentSubmit, compositsUpdated', compositsUpdated)
    // const compositsUpdated = composits.map((composit) => {
    //   if (composit.name == currentComposit) {
    //     composit.components = composit.components.map(component => {
    //       if (component.name == componentInput){
    //         component.subComponents.push(response.subComponent)
    //       }
    //     });
    //   }
    //   return composit;
    // })
    // console.log('handleSubComponentSubmit, compositsUpdated: ', compositsUpdated);
    setComposits(compositsUpdated);
  };

  const updateComponentWithNewSubcomponent = (componentObj, selectedComponent, receivedSubComponent) => {
    console.log('updateComponentWithNewSubcomponent, componentObj: ', componentObj);
    if (componentObj.id == selectedComponent.id) {
      componentObj.subcomponents ??= []; // Nullish coalescing assignment
      componentObj.subcomponents?.push(receivedSubComponent);
    }

    if (componentObj.subcomponents?.length > 0) {
      componentObj.subcomponents.map((component) => {
        updateComponentWithNewSubcomponent(component, selectedComponent, receivedSubComponent);
      })
    }
    console.log('handleSubComponentSubmit, componentObj after if{}: ', componentObj);
    return componentObj;
  }

  // const SubComponentInput = ({input}) => {
  //   console.log('SubComponentInput render');
  //   return (
  //     <>

  //           {/* <Stack direction="row" alignItems="center" gap={1}>
  //             <TextField
  //               required
  //               fullWidth
  //               id="new-subcomponent"
  //               label="SubComponent"
  //               name="subcomponent"
  //               autoComplete="subcomponent"
  //               // autoFocus
  //               value={input}
  //               onChange={handleSubComponentInputChange}
  //             />
  //             <IconButton
  //               onClick={handleSubComponentInputSubmit}
  //               sx={{ mt: 2, mb: 2 }}
  //             >
  //               <CheckCircleIcon />
  //             </IconButton>
  //             <IconButton
  //               onClick={handleSubComponentInputCancel}
  //               sx={{ mt: 2, mb: 2 }}
  //             >
  //               <CancelIcon />
  //             </IconButton>
  //           </Stack> */}
  //        <Stack direction="row" alignItems="center" gap={1}>
  //                 <TextField
  //                   required
  //                   fullWidth
  //                   id="new-subComponent"
  //                   label="subComponent"
  //                   name="subComponent"
  //                   autoComplete="subComponent"
  //                   autoFocus
  //                   value={input}
  //                   onChange={handleSubComponentInputChange}
  //                 />
  //                 <IconButton
  //                   onClick={handleSubComponentInputSubmit}
  //                   sx={{ mt: 2, mb: 2 }}
  //                 >
  //                   <CheckCircleIcon />
  //                 </IconButton>
  //                 <IconButton
  //                   onClick={handleSubComponentInputCancel}
  //                   sx={{ mt: 2, mb: 2 }}
  //                 >
  //                   <CancelIcon />
  //                 </IconButton>
  //               </Stack>

  //     </>)
  // }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      {/* <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Input placeholder="Placeholder" />
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <ListItem>
            <ListItemText
              primary="Single-line item"
            />
            <IconButton edge="start" aria-label="delete">
              <DeleteIcon />
            </IconButton>
            <IconButton edge="end" aria-label="more"
               onClick={() => {
              }}
            >
              <MoreHorizIcon />
            </IconButton>
            <IconButton edge="end" aria-label="add"
               onClick={() => {
                window.electron.testRenderer.sendAddSubcomponent((response) => {
                  console.log(`response from server: ${response}`);
                });
              }}
            >
              <AddCircleIcon />
            </IconButton>
          </ListItem>
        </List>
      </Box> */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          First Page
        </Typography>
        <Button sx={{ mt: 1, mb: 1 }} variant="contained" onClick={getComposits}>Sync Composits</Button>
        {/* <Box component='form' onSubmit={handleComponentSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            id="new-composit"
            label="Composit"
            name="composit"
            autoComplete="composit"
          />
          <IconButton
            type="button"
            onClick={handleCompositSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            type="reset"
            sx={{ mt: 3, mb: 2 }}
          >
            <CancelIcon />
          </IconButton>
        </Box> */}
        {
          addCompositPressed ?
            <InputBox textFieldId={"new-composit"} textFieldLabel={"Composit"} textFieldName={"composit"} input={compositInput} handleInputChange={handleCompositInputChange} handleInputCancel={handleCompositInputCancel} handleInputSubmit={handleCompositInputSubmit} />
            :
            <Button sx={{ mt: 1, mb: 1 }} variant="contained" onClick={handleAddComposit}>Add Composit</Button>
        }

        <Typography component="h2" variant="h5">
          Composits and Components
        </Typography>
        {composits && composits.map((composit) => (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {((currentComposit?.name == composit.name) && renameCompositPressed) ?
                <InputBox textFieldId={"rename-composit"} textFieldLabel={"Composit"} textFieldName={"composit"} input={compositInput} handleInputChange={handleCompositInputChange} handleInputCancel={handleCompositInputCancel} handleInputSubmit={() => handleRenameCompositSubmit(currentComposit, compositInput)} />
                :
                <Stack direction="row" alignItems="center" gap={1}>
                      <Typography component="h1" variant="h5">
                        {composit?.name}
                      </Typography>
                      <EntityButtons handleAddButton={() => handleAddComponent(composit)} handleDeleteButton={() => deleteComposit(composit)} handleRenameButton={() => handleRenameComposit(composit)} />
                </Stack>
              }
              {composit?.components && composit?.components.map((component) => (
                // <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                //   <ListItem
                //     key={component?.id}
                //   >
                //     <ListItemText primary={`Line item ${component?.name}, id:  ${component?.id}`} />
                //     <IconButton
                //       onClick={() => handleAddSubComponent(composit?.id, component?.id)}
                //       sx={{ mt: 2, mb: 2 }}
                //       aria-label="check"
                //     >
                //       <AddCircleIcon />
                //     </IconButton>
                //     <IconButton aria-label="delete" onClick={() => deleteComponent(composit?.name, component?.name)}>
                //       <DeleteIcon />
                //     </IconButton>
                //   </ListItem>
                // </List>
                <ListOfComponents
                  composit={composit}
                  component={component}
                  deleteComponentCb={() => deleteComponent(composit, component)}
                  handleSubComponentSubmitCb={handleSubComponentSubmit}
                  currentComponent={currentComponent}
                  setCurrentComponent={setCurrentComponent}
                  componentInput={componentInput}
                  handleComponentInputChange={handleComponentInputChange}
                  handleComponentInputCancel={handleComponentInputCancel}
                  renameComponentPressed={renameComponentPressed}
                  handleRenameComponentCb={handleRenameComponent}
                  handleRenameComponentSubmitCb={() => handleRenameComponentSubmit(composit, currentComponent, componentInput)}


                />
              ))}

              {addComponentPressed && (currentComposit?.name == composit?.name) && (
                <InputBox textFieldId={"new-component"} textFieldLabel={"Component"} textFieldName={"component"} input={componentInput} handleInputChange={handleComponentInputChange} handleInputCancel={handleComponentInputCancel} handleInputSubmit={handleComponentInputSubmit} />


              )}
            </Box>
          </>
        ))}
      </Box>
    </Container>
  )


}


function InputBox({ input, textFieldId, textFieldLabel, textFieldName, handleInputChange, handleInputCancel, handleInputSubmit }) {
  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <TextField
          required
          fullWidth
          id={textFieldId}
          label={textFieldLabel}
          name={textFieldName}
          autoComplete={textFieldName}
          value={input}
          onChange={handleInputChange}
        />
        <IconButton
          onClick={handleInputSubmit}
          sx={{ mt: 2, mb: 2 }}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton
          onClick={handleInputCancel}
          sx={{ mt: 2, mb: 2 }}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    </>
  )
}

function EntityButtons({ handleAddButton, handleDeleteButton, handleRenameButton }) {
  return (
      <>
      <IconButton
        // onClick={() => handleAddButton(entity)}
        onClick={handleAddButton}
        sx={{ mt: 2, mb: 2 }}
      >
        <AddCircleIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={handleDeleteButton}>
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="rename" onClick={handleRenameButton}>
        <DriveFileRenameOutlineOutlinedIcon />
      </IconButton>
      </>
  )
}

function ListOfComponents({ composit, component, deleteComponentCb, renameComponentPressed, handleSubComponentSubmitCb, handleRenameComponentCb, currentComponent, setCurrentComponent, componentInput, handleComponentInputChange, handleComponentInputCancel, handleRenameComponentSubmitCb }) {
  console.log("ListOfComponents, renameComponentPressed: ", renameComponentPressed);
  console.log("ListOfComponents, currentComponent: ", currentComponent);
  const [subComponentInput, setSubComponentInput] = React.useState('');
  const [addSubComponentPressed, setAddSubComponentPressed] = React.useState(false);


  const handleAddSubComponent = async (currentComponentObj) => {
    console.log('handleAddSubComponent called, currentComponentObj: ', currentComponentObj);
    console.log('handleAddSubComponent called, addSubComponentPressed: ', addSubComponentPressed);
    setCurrentComponent(currentComponentObj);
    setAddSubComponentPressed(true);
  };

  const handleSubComponentInputChange = (event) => {
    console.log('handleSubComponentInputChange, value: ', event.target.value);
    setSubComponentInput(event.target.value);
  };

  const handleSubComponentInputSubmit = (composit, component, subComponentInput) => {
    handleSubComponentSubmitCb(composit, component, subComponentInput);
    setSubComponentInput('');
    setAddSubComponentPressed(false);
  };
  const handleSubComponentInputCancel = (event) => {
    setSubComponentInput('');
    setAddSubComponentPressed(false);
  };

  console.log('ListOfSubComponents render');
  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem
          key={component.id}
        >


          {((currentComponent?.name == component.name) && renameComponentPressed) ?
            <InputBox textFieldId={"rename-component"} textFieldLabel={"Component"} textFieldName={"component"} input={componentInput} handleInputChange={handleComponentInputChange} handleInputCancel={handleComponentInputCancel} handleInputSubmit={handleRenameComponentSubmitCb} />
            :
              
            <>

              <ListItemText primary={`Component: ${component?.name}, id:  ${component?.id}`} />
              <IconButton
                onClick={() => handleAddSubComponent(component)}
                aria-label="check"
              >
                <AddCircleIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={deleteComponentCb}>
                <DeleteIcon />
              </IconButton>

              <IconButton aria-label="rename" onClick={() => handleRenameComponentCb(component)}>
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
            </>
          }

        </ListItem>
        {component.subcomponents && component.subcomponents?.map((subcomponent) => (
          <>
            <ListItem>
              <ListOfComponents
                composit={composit}
                component={subcomponent}
                deleteComponentCb={deleteComponentCb}
                handleSubComponentSubmitCb={handleSubComponentSubmitCb}
                currentComponent={currentComponent}
                setCurrentComponent={setCurrentComponent}
                componentInput={componentInput}
                handleComponentInputChange={handleComponentInputChange}
                handleComponentInputCancel={handleComponentInputCancel}
                renameComponentPressed={renameComponentPressed}
                handleRenameComponentCb={handleRenameComponentCb}
                handleRenameComponentSubmitCb={handleRenameComponentSubmitCb}
              />
            </ListItem>

          </>
        ))}
        {addSubComponentPressed && (currentComponent?.name == component?.name) && (
          <>
            <InputBox textFieldId={'new-subComponent'} textFieldLabel={"SubComponent"} textFieldName={"subcomponent"} input={subComponentInput} handleInputChange={handleSubComponentInputChange} handleInputCancel={handleSubComponentInputCancel} handleInputSubmit={() => handleSubComponentInputSubmit(composit, component, subComponentInput)} />
          </>
        )}
      </List>

    </>)
}