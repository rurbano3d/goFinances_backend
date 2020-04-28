import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome, total } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        const { type, value } = transaction;
        switch (type) {
          case 'income':
            accumulator.income += value;
            accumulator.total += value;
            break;

          case 'outcome':
            accumulator.outcome += value;
            accumulator.total -= value;
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const balance = {
      total,
      income,
      outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
