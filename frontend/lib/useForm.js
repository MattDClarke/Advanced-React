import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value) || 0;
    }
    if (type === 'file') {
      // get first item in .files array
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      // dynamic property computed property name - e.target.name and e.target.value
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    // returns an object
    const blankState = Object.fromEntries(
      // returns an array
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  return { inputs, handleChange, clearForm, resetForm };
}
