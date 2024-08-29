import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const handleDelete = async (endpoint, code, name, setItems, items, setEditingRow = null) => {
  try {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the item with the name: ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      const response = await axios.delete(`${endpoint}/${code}`);
      
      console.log('Delete response:', response);

      if (response.status >= 200 && response.status < 300) {
        setItems(items.filter((item) => item.code !== code));
        MySwal.fire(
          'Deleted!',
          `Item with name: ${name} has been deleted.`,
          'success'
        );
      } else {
        throw new Error(`Failed to delete. Server responded with status: ${response.status}`);
      }
    } else {
      if (setEditingRow) {
        setEditingRow(null);
      }
    }
  } catch (error) {
    console.error("Error deleting item", error.message);
    MySwal.fire('Error!', `Failed to delete the item: ${error.message}`, 'error');
  }
};

export default handleDelete;
