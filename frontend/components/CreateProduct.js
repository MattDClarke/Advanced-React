import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # which variables are getting passed in and what types are they?
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm } = useForm({
    image: '',
    name: '',
    price: 0,
    description: '',
  });
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );
  // console.log(createProduct);

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // console.log(inputs);
        const res = await createProduct();
        // console.log(res);
        clearForm();
        // go to that products page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            id="image"
            type="file"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            id="price"
            type="number"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          description
          <textarea
            id="price"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
