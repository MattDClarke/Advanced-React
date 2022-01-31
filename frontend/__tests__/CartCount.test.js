import { render, screen } from '@testing-library/react';
import wait from 'waait';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('Renders', () => {
    render(<CartCount count={10} />);
  });
  it('Matches snapshot', () => {
    const { container } = render(<CartCount count={11} />);
    expect(container).toMatchSnapshot();
  });
  it('updates via props', async () => {
    const { container, rerender, debug } = render(<CartCount count={11} />);
    expect(container.textContent).toBe('11');
    // same as:
    // expect(container).toHaveTextContent('11');
    // Update the props
    rerender(<CartCount count={12} />);
    // wait for CSSTransitionGroup animation to complete
    // wait for ... ms
    // CSSTRansition group - incoming 12 component and outgoing 11 component briefly in DOM together
    expect(container.textContent).toBe('1211');
    await wait(400);
    // this method will timeout after 3s if it cant find the text
    // await screen.findByText('12');
    expect(container.textContent).toBe('12');
    expect(container).toMatchSnapshot();
    debug();
  });
});
