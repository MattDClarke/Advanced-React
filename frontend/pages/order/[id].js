import PleaseSignIn from '../../components/PleaseSignIn';
import SingleOrder from '../../components/SingleOrder';

export default function SingleOrderPage({ id }) {
  return (
    <PleaseSignIn>
      <SingleOrder id={id} />
    </PleaseSignIn>
  );
}
