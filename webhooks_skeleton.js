import { Database } from 'sqlite3';
import axios from 'axios';


const webhook = "https://nylas-webhooks-project.herokuapp.com/webhook";
const db = new Database('./webhooks.db');

const postAllTransactions = async transactions => {
  let delay = 500;
  let currentItem = 0;
  let timeout = setTimeout(async function doPost() {
    let status;
    const res = await axios
        .post(webhook, transactions[currentItem])
        .catch(e => {
          // handle UnhandledPromiseRejectionWarning error
          status = e.response.status;
        });
    if (!status) {
      status = res.status;
    }

    // check the status of the response
    if (status === 500) {
      // add .5 seconds to the delay
      delay += 500;
    } else if (status === 200) {
      // reset the delay.
      delay = 500;
      // go to the next transaction
      currentItem++;
    }

    // post the currentItem
    if (currentItem < transactions.length) {
      timeout = setTimeout(doPost, delay);
    }
  }, delay);
};

// retrieve transactions and then post them to the webhook.
function processTransactions() {
  const transactions = [];
  console.log("start");
  db.each('SELECT * FROM transactions;', {}, (err, row) => {
    transactions.push(row);
  }, () => {
    postAllTransactions(transactions);
  });
}


processTransactions();
