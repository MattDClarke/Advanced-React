import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';

import DisplayError from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';

// turn string into GraphQL query
export const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      items {
        id
        name
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
        price
        quantity
      }
      _itemsMeta {
        count
      }
    }
    _allOrdersMeta {
      count
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function calcTotal(allOrders) {
  let sum = 0;
  allOrders.forEach((order) => {
    sum += order.total;
  });
  return sum;
}

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function Orders() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  // console.log(data, error, loading);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders, _allOrdersMeta } = data;
  return (
    <div>
      <Head>
        <title>
          Your {_allOrdersMeta.count} order{_allOrdersMeta.count > 1 ? 's' : 1}
        </title>
      </Head>
      <h2>
        You have {_allOrdersMeta.count} order
        {_allOrdersMeta.count > 1 ? 's' : 1}.{' '}
      </h2>
      <h3>Total spent: {formatMoney(calcTotal(allOrders))}</h3>

      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className="order-meta">
                  <p>
                    {countItemsInAnOrder(order)} Item
                    {countItemsInAnOrder(order) > 1 ? 's' : ''}
                  </p>
                  <p>
                    {order._itemsMeta.count} Product
                    {order._itemsMeta.count > 1 ? 's' : ''}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={`image-${item.id}`}
                      src={item.photo?.image?.publicUrlTransformed}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
