import Head from "next/head";
import styles from "../styles/Home.module.css";
// importing api
import CoinGecko from "coingecko-api";

const client = new CoinGecko();

export default function Home(props) {
  const { data } = props.result;
  console.log(data);

  const formatPercent = (number) => `${new Number(number).toFixed(2)}%`;

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits,
    }).format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title>CoinNicaMarket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 center>Coin Nica Market</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>24H Change</th>
            <th>Price</th>
            <th>Market cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img
                  src={coin.image}
                  style={{ width: 25, height: 25, marginRight: 10 }}
                />
                {coin.symbol.toUpperCase()}
              </td>
              <td>
                <span
                  className={
                    coin.price_change_percentage_24h > 0
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td>{formatDollar(coin.current_price, 20)}</td>
              <td>{formatDollar(coin.market_cap, 12)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// function gathers data from incoming request
export async function getServerSideProps(context) {
  const obj = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC,
  };
  // get highest prices for 100 largest coin
  const result = await client.coins.markets({ obj });
  return {
    props: {
      result,
    },
  };
}
