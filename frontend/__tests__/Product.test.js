import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CartStateProvider } from '../lib/CartState';
import Product from '../components/Product';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

describe('<Product />', () => {
  it('renders out the price tag and title', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Product product={product} />
        </MockedProvider>
      </CartStateProvider>
    );

    // many matchers (like toBeInTheDocument) available
    // matchers from React Testing Library imported in jest.setup.js
    const priceTag = screen.getByText('$50');
    // debug(priceTag);
    expect(priceTag).toBeInTheDocument();
    const link = container.querySelector('a');
    // debug(link);
    expect(link).toHaveAttribute('href', '/product/abc123');
    expect(link).toHaveTextContent(product.name);
  });

  it('Renders and matches the snapshot', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Product product={product} />
        </MockedProvider>
      </CartStateProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the image properly', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider>
          <Product product={product} />
        </MockedProvider>
      </CartStateProvider>
    );
    // grab the image
    const img = screen.getByAltText(product.name);
    expect(img).toBeInTheDocument();
  });
});
