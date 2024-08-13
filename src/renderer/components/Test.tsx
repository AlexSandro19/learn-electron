import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button, Stack } from '@mui/material';
import EntityButtons from './EntityButtons';
import InputBox from './InputBox';

export default function Test() {
  const [composits, setComposits] = useState([]);
  const [compositInput, setCompositInput] = useState('');
  const [currentComposit, setCurrentComposit] = useState(null);
  const [addCompositPressed, setAddCompositPressed] = useState(false);
  const [renameCompositPressed, setRenameCompositPressed] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [renameComponentPressed, setRenameComponentPressed] = useState(false);
  const [addComponentPressed, setAddComponentPressed] = useState(false);
  const [componentInput, setComponentInput] = useState('');
  const [didReceiveError, setDidReceiveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getComposits();
  }, []);

  const handleCompositSubmit = async () => {
    const response = await window.electron.testRenderer.invokeAddComposit({ data: { compositName: compositInput } });
    console.log('handleCompositSubmit, response: ', response);
    if (response?.composit) {
      setComposits([...composits, response.composit]);
      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }
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
    if (response?.composits) {
      setComposits(response.composits);
      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }
  };

  const deleteComposit = async (compositToDelete) => {
    const response = await window.electron.testRenderer.invokeDeleteComposit({ data: { compositId: compositToDelete?.id } });
    console.log('deleteComposit, response: ', response);

    if (response?.isCompositDeleted) {
      const updatedComposits = composits.filter((composit) => composit?.id != compositToDelete?.id);
      setComposits(updatedComposits);
      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }
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
    setCompositInput(composit?.name);
  }

  const handleRenameCompositSubmit = async (compositToRename, newCompositName) => {
    const response = await window.electron.testRenderer.invokeRenameComposit({ data: { compositId: compositToRename?.id, newCompositName } });
    console.log('renameComposit, response: ', response);

    if (response?.isCompositUpdated) {
      const updatedComposits = composits.map((compositObj) => {
        if (compositObj?.id == compositToRename?.id) {
          compositObj.name = newCompositName;
        }
        return compositObj;
      });

      setComposits(updatedComposits);
      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }

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

  const handleComponentSubmit = async () => {
    console.log('handleComponentSubmit, componentInput: ', componentInput);
    // console.log('handleComponentSubmit, previousCompositInput: ', previousCompositInput);
    const response = await window.electron.testRenderer.invokeAddComponent({ data: { componentName: componentInput, compositId: currentComposit?.id } });
    // console.log('handleComponentSubmit, response: ', response);

    if (response?.component) {
      const compositsUpdated = composits.map((composit) => {
        if (composit?.id == currentComposit?.id) {
          composit.components?.push(response.component)
        }
        return composit;
      })
      console.log('handleComponentSubmit, compositsUpdated: ', compositsUpdated);
      setComposits(compositsUpdated);

      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }
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

    if (response?.isComponentDeleted) {
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

      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }

  }

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

  const handleRenameComponent = (component) => {
    console.log("handleRenameComponent called, component: ", component)
    setAddComponentPressed(false);
    setRenameComponentPressed(true);
    setCurrentComponent(component);
    setComponentInput(component?.name);
  }

  const handleRenameComponentSubmit = async (composit, componentToRename, newComponentName) => {
    const response = await window.electron.testRenderer.invokeRenameComponent({ data: { componentId: componentToRename?.id, newComponentName } });
    console.log('handleRenameComponentSubmit, response: ', response);

    if (response?.isComponentUpdated) {
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

      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }


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

    if (response?.subComponent) {
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
      setComposits(compositsUpdated);

      setDidReceiveError(false);
      setErrorMessage('');
    } else if (response?.error) {
      setDidReceiveError(true);
      setErrorMessage(response.msg);
    } else {
      setDidReceiveError(true);
      setErrorMessage("Server error occured.");
    }



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


  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
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
        {didReceiveError && (
          <div>
            <p>{errorMessage}</p>
          </div>
        )}
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
              {((currentComposit?.name == composit?.name) && renameCompositPressed) ?
                <InputBox textFieldId={"rename-composit"} textFieldLabel={"Composit"} textFieldName={"composit"} input={compositInput} handleInputChange={handleCompositInputChange} handleInputCancel={handleCompositInputCancel} handleInputSubmit={() => handleRenameCompositSubmit(currentComposit, compositInput)} />
                :
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography component="h1" variant="h5">
                    {composit?.name}
                  </Typography>
                  <EntityButtons handleAddButtonCbFn={() => handleAddComponent(composit)} handleDeleteButtonCbFn={() => deleteComposit(composit)} handleRenameButtonCbFn={() => handleRenameComposit(composit)} />
                </Stack>
              }
              {composit?.components && composit?.components.map((component) => (
                <ListOfComponents
                  composit={composit}
                  component={component}
                  deleteComponentCb={deleteComponent}
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


function ListOfComponents({ composit, component, deleteComponentCb, renameComponentPressed, handleSubComponentSubmitCb, handleRenameComponentCb, currentComponent, setCurrentComponent, componentInput, handleComponentInputChange, handleComponentInputCancel, handleRenameComponentSubmitCb }) {
  console.log("ListOfComponents, renameComponentPressed: ", renameComponentPressed);
  console.log("ListOfComponents, currentComponent: ", currentComponent);
  const [subComponentInput, setSubComponentInput] = useState('');
  const [addSubComponentPressed, setAddSubComponentPressed] = useState(false);


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
          sx={{ padding: 0 }}
        >
          {((currentComponent?.name == component?.name) && renameComponentPressed) ?
            <InputBox textFieldId={"rename-component"} textFieldLabel={"Component"} textFieldName={"component"} input={componentInput} handleInputChange={handleComponentInputChange} handleInputCancel={handleComponentInputCancel} handleInputSubmit={handleRenameComponentSubmitCb} />
            :
            <>
              <ListItemText primary={`Component: ${component?.name}, id:  ${component?.id}`} />
              <EntityButtons handleAddButtonCbFn={() => handleAddSubComponent(component)} handleDeleteButtonCbFn={() => deleteComponentCb(composit, component)} handleRenameButtonCbFn={() => handleRenameComponentCb(component)} />
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