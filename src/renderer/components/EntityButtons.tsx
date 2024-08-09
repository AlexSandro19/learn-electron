import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';


export default function EntityButtons({ handleAddButtonCbFn, handleDeleteButtonCbFn, handleRenameButtonCbFn }) {
  return (
      <>
      <IconButton
        onClick={handleAddButtonCbFn}
        sx={{ mt: 2, mb: 2 }}
        aria-label="add"
      >
        <AddCircleIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={handleDeleteButtonCbFn}>
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="rename" onClick={handleRenameButtonCbFn}>
        <DriveFileRenameOutlineOutlinedIcon />
      </IconButton>
      </>
  )
}