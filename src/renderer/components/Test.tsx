
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
  const [addComponentPressed, setAddComponentPressed] = React.useState(false);
  const [previousCompositInput, setPreviousCompositInput] = React.useState('');
  const [componentInput, setComponentInput] = React.useState('');
  const [previousComponentInput, setPreviousComponentInput] = React.useState('');

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
    const response = await window.electron.testRenderer.invokeAddComposit({ data: { composit: compositInput } });
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
    setPreviousCompositInput(compositInput);
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

  const deleteComposit = async (name) => {
    const response = await window.electron.testRenderer.invokeDeleteComposit({ data: { name } });
    console.log('deleteComposit, response: ', response);
    if (response.isCompositDeleted) {
      const updatedComposits = composits.filter((composit) => composit?.name != name);
      setComposits(updatedComposits);
    }
    // else print the error message
  }

  const handleAddComposit = () => {
    setAddCompositPressed(true);
  }

  const handleRenameComposit = (composit) => {
    setRenameCompositPressed(true);
    setCurrentComposit(composit);
    setCompositInput(composit.name);
  }

  const handleRenameCompositSubmit = async (composit, newCompositName) => {
    const response = await window.electron.testRenderer.invokeRenameComposit({ data: { composit: { ...composit, name: newCompositName } } });
    console.log('renameComposit, response: ', response);
    if (response.isCompositUpdated) {
      const updatedComposits = composits.map((compositObj) => {
        console.log('renameComposit, composit?.name == newCompositName: ', (composit?.name == newCompositName));
        console.log('renameComposit, composit?.name: ', composit?.name);
        console.log('renameComposit, newCompositName: ', newCompositName);

        if (compositObj?.id == composit?.id) {
          compositObj.name = newCompositName;
        }
        return compositObj;
      });
      setComposits(updatedComposits);
    }
    const updatedComposits = composits.map((composit) => {
      console.log('renameComposit, composit?.name == newCompositName: ', (composit?.name == newCompositName));
      console.log('renameComposit, composit?.name: ', composit?.name);
      console.log('renameComposit, newCompositName: ', newCompositName);

      if (composit?.id == response.updatedComposit?.id) {
        composit.name = response.updatedComposit.name;
        console.log('renameComposit, composit: ', composit);
      }
      return composit;
    });
    setComposits(updatedComposits);
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
  };
  const handleComponentInputCancel = (event) => {
    setComponentInput('');
    setAddComponentPressed(false);
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
    const response = await window.electron.testRenderer.invokeAddComponent({ data: { component: componentInput, composit: currentComposit.name } });
    // console.log('handleComponentSubmit, response: ', response);
    const compositsUpdated = composits.map((composit) => {
      if (composit.name == currentComposit.name) {
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
    setAddComponentPressed(true);
  };

  const deleteComponent = async (compositName, componentName, parentComponentName = null) => {
    const response = await window.electron.testRenderer.invokeDeleteComponent({ data: { composit: compositName, component: componentName, parentComponent: parentComponentName } });
    // console.log('deleteComponent, response: ', response);
    const updatedComposits = composits.map((composit) => {
      if (composit.name == compositName) {
        // console.log('deleteComponent, composit: ', composit)
        // composit.components = composit.components?.filter((component) => component?.name != componentName);
        composit.components = composit.components?.filter((component) => {
          return deleteComponentRecurive(component, componentName)
        });
        console.log('deleteComponent, composit: ', composit);
      }
      return composit;
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

  const deleteComponentRecurive = (componentObj, componentName) => {
    console.log('deleteComponentRecurive, componentObj: ', componentObj);
    console.log('deleteComponentRecurive, componentName: ', componentName);

    if (componentObj.subcomponents?.length > 0) {
      componentObj.subcomponents = componentObj.subcomponents.filter((component) => {
        return deleteComponentRecurive(component, componentName);
      })

    }
    console.log('componentObj: ', componentObj);

    if (componentObj.name == componentName) {
      console.log('deleteComponentRecurive, componentObj == componentName');
      return false;
    }

    // console.log('deleteComponentRecurive, componentObj: ', componentObj);
    return componentObj;
  }

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







  const handleSubComponentSubmit = async (selectedComposit, selectedComponent, subComponentInput) => {
    console.log('handleSubComponentSubmit, subComponentInput: ', subComponentInput);
    // console.log('handleSubComponentSubmit, previousCompositInput: ', previousCompositInput);
    const response = await window.electron.testRenderer.invokeAddSubComponent({ data: { subComponent: subComponentInput, component: selectedComponent.name, composit: selectedComposit.name } });
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
                <EntityBox entity={composit} handleAddButton={handleAddComponent} handleDeleteButton={deleteComposit} handleRenameButton={handleRenameComposit} />

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
                <ListOfComponents composit={composit} component={component} deleteComponent={deleteComponent} handleSubComponentSubmit={handleSubComponentSubmit} currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} />
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

function EntityBox({ entity, handleAddButton, handleDeleteButton, handleRenameButton }) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography component="h1" variant="h5">
        {entity?.name}
      </Typography>
      <IconButton
        onClick={() => handleAddButton(entity)}
        sx={{ mt: 2, mb: 2 }}
      >
        <AddCircleIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => handleDeleteButton(entity?.name)}>
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="rename" onClick={() => handleRenameButton(entity)}>
        <DriveFileRenameOutlineOutlinedIcon />
      </IconButton>
    </Stack>

  )

}

function ListOfComponents({ composit, component, deleteComponent, handleSubComponentSubmit, currentComponent, setCurrentComponent, parentComponent = null }) {
  console.log("ListOfComponents, deleteComponent: ", deleteComponent)
  const [subComponentInput, setSubComponentInput] = React.useState('');
  const [addSubComponentPressed, setAddSubComponentPressed] = React.useState(false);


  const handleAddSubComponent = async (currentComponent) => {
    console.log('handleAddSubComponent called, currentComponent: ', currentComponent);
    console.log('handleAddSubComponent called, addSubComponentPressed: ', addSubComponentPressed);
    setCurrentComponent(currentComponent);
    setAddSubComponentPressed(true);
  };

  const handleSubComponentInputChange = (event) => {
    console.log('handleSubComponentInputChange, value: ', event.target.value);
    setSubComponentInput(event.target.value);
  };

  const handleSubComponentInputSubmit = (composit, component, subComponentInput) => {
    handleSubComponentSubmit(composit, component, subComponentInput);
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
          <ListItemText primary={`Component: ${component?.name}, id:  ${component?.id}`} />
          <IconButton
            onClick={() => handleAddSubComponent(component)}
            aria-label="check"
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteComponent(composit?.name, component?.name, parentComponent?.name)}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="rename" onClick={() => deleteComponent(composit?.name, component?.name, parentComponent?.name)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
        {component.subcomponents && component.subcomponents?.map((subcomponent) => (
          <>
            <ListItem>
              <ListOfComponents composit={composit} component={subcomponent} parentComponent={component} deleteComponent={deleteComponent} handleSubComponentSubmit={handleSubComponentSubmit} currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} />
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