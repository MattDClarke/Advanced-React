import PleaseSignIn from '../components/PleaseSignIn';
import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ id }) {
  //   console.log(id);
  return (
    <PleaseSignIn>
      <div>
        <UpdateProduct id={id} />
      </div>
    </PleaseSignIn>
  );
}
