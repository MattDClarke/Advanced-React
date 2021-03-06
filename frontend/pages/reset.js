import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage({ token }) {
  if (!token) {
    return (
      <div>
        <p>Sorry you must supply a token</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <p>RESET YOUR PASSWORD {token}</p>
      <Reset token={token} />
    </div>
  );
}
