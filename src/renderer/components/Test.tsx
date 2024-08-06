
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
import Switch from '@mui/material/Switch';
import WifiIcon from '@mui/icons-material/Wifi';
import IconButton from '@mui/material/IconButton';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export default function Test() {
  const [composits, setComposits] = React.useState([]);
  const [compositInput, setCompositInput] = React.useState('');
  const [currentComposit, setCurrentComposit] = React.useState('');
  const [currentComponent, setCurrentComponent] = React.useState('');
  const [addComponentPressed, setAddComponentPressed] = React.useState(false);
  const [addSubComponentPressed, setAddSubComponentPressed] = React.useState(false);
  const [previousCompositInput, setPreviousCompositInput] = React.useState('');
  const [componentInput, setComponentInput] = React.useState('');
  const [subComponentInput, setSubComponentInput] = React.useState('');
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
    setCompositInput('');
  };

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
    const response = await window.electron.testRenderer.invokeAddComponent({ data: { component: componentInput, composit: currentComposit } });
    // console.log('handleComponentSubmit, response: ', response);
    const compositsUpdated = composits.map((composit) => {
      if (composit.name == currentComposit) {
        composit.components?.push(response.component)
      }
      return composit;
    })
    console.log('handleComponentSubmit, compositsUpdated: ', compositsUpdated);
    setComposits(compositsUpdated);
  };

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

  const updateComponentWithNewSubcomponent = (componentObj, selectedComponent, receivedSubComponent) => {
    console.log('handleSubComponentSubmit, componentObj: ', componentObj);
    if (componentObj.id == selectedComponent.id) {
      componentObj.subcomponents ??= []; // Nullish coalescing assignment
      componentObj.subcomponents?.push(receivedSubComponent);
    }
    
    if (componentObj.subcomponents?.length > 0){
      componentObj.subcomponents.map((component) => {
        updateComponentWithNewSubcomponent(component, selectedComponent, receivedSubComponent);
      })
    }
    console.log('handleSubComponentSubmit, componentObj after if{}: ', componentObj);
    return componentObj;
  }

  const getComposits = async () => {
    const response = await window.electron.testRenderer.invokeGetComposits();
    console.log('getComposits, response: ', response);
    setComposits(response.composits);
  };

  const deleteComposit = async (name) => {
    const response = await window.electron.testRenderer.invokeDeleteComposit({ data: { name } });
    console.log('deleteComposit, response: ', response);
    const updatedComposits = composits.filter((composit) => composit?.name != name);
    setComposits(updatedComposits);
  }

  const handleAddComponent = async (currentCompositName) => {
    console.log('handleAddComponent called, currentCompositName: ', currentCompositName);
    console.log('handleAddComponent called, currentComposit: ', currentComposit);
    console.log('handleAddComponent called, addComponentPressed: ', addComponentPressed);
    setCurrentComposit(currentCompositName);
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

    if (componentObj.subcomponents?.length > 0){
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

  const handleAddSubComponent = async (currentComponentName) => {
    console.log('handleAddSubComponent called, currentComponentName: ', currentComponentName);
    console.log('handleAddSubComponent called, addSubComponentPressed: ', addSubComponentPressed);
    setCurrentComponent(currentComponentName);
    setAddSubComponentPressed(true);
  };

  const ListOfSubComponents = ({ composit, component, parentComponent = null }) => {
    console.log('ListOfSubComponents render');
    return (
      <>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem
            key={component.id}
          >
            <ListItemText primary={`Component: ${component?.name}, id:  ${component?.id}`} />
            <IconButton
              onClick={() => handleAddSubComponent(component?.name)}
              aria-label="check"
            >
              <AddCircleIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => deleteComponent(composit?.name, component?.name, parentComponent?.name)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
          {component.subcomponents && component.subcomponents?.map((subcomponent) => (
            <>
              <ListItem>
                <ListOfSubComponents composit={composit} component={subcomponent} parentComponent={component} />
              </ListItem>

            </>
          ))}
          {addSubComponentPressed && (currentComponent == component?.name) && (
             <>
             <Stack direction="row" alignItems="center" gap={1}>
               <TextField
                 required
                 fullWidth
                 id="new-subcomponent"
                 label="SubComponent"
                 name="subcomponent"
                 autoComplete="subcomponent"
                 autoFocus
                 value={subComponentInput}
                 onChange={handleSubComponentInputChange}
               />
               <IconButton
                 onClick={() => handleSubComponentInputSubmit(composit, component, subComponentInput)}
                 sx={{ mt: 2, mb: 2 }}
               >
                 <CheckCircleIcon />
               </IconButton>
               <IconButton
                 onClick={handleSubComponentInputCancel}
                 sx={{ mt: 2, mb: 2 }}
               >
                 <CancelIcon />
               </IconButton>
             </Stack>
       </>
          )}
        </List>

      </>)
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
        <Button variant="contained" onClick={getComposits}>Sync Composits</Button>
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
        <Stack direction="row" alignItems="center" gap={1}>
          <TextField
            required
            fullWidth
            id="new-composit"
            label="Composit"
            name="composit"
            autoComplete="composit"
            value={compositInput}
            onChange={handleCompositInputChange}
          />
          <IconButton
            onClick={handleCompositInputSubmit}
            sx={{ mt: 2, mb: 2 }}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            onClick={handleCompositInputCancel}
            sx={{ mt: 2, mb: 2 }}
          >
            <CancelIcon />
          </IconButton>
        </Stack>

        {composits && composits.map((composit) => (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography component="h1" variant="h5">
                  {composit?.name}
                </Typography>
                <IconButton
                  onClick={() => handleAddComponent(composit?.name)}
                  sx={{ mt: 2, mb: 2 }}
                >
                  <AddCircleIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => deleteComposit(composit?.name)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
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

                <ListOfSubComponents composit={composit} component={component} />
              ))}

              {addComponentPressed && (currentComposit == composit?.name) && (
                <Stack direction="row" alignItems="center" gap={1}>
                  <TextField
                    required
                    fullWidth
                    id="new-component"
                    label="Component"
                    name="component"
                    autoComplete="component"
                    value={componentInput}
                    onChange={handleComponentInputChange}
                  />
                  <IconButton
                    onClick={handleComponentInputSubmit}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleComponentInputCancel}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </>
        ))}
      </Box>
    </Container>
  )
}


