import Orders from '../components/Orders';
import PleaseSignIn from '../components/PleaseSignIn';

export default function OrderPage() {
  return (
    <PleaseSignIn>
      <div>
        <Orders />
      </div>
    </PleaseSignIn>
  );
}
