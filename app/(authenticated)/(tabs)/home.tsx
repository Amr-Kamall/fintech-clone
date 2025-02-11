import DropDownMenu from "@/components/DropdownMenu";
import RoundButton from "@/components/RoundButton";
import WidgetList from "@/components/sortableList/WidgetList";
import Colors from "@/constants/Colors";
import { useFintech } from "@/store/FintechContext";
import { StatusBar } from "expo-status-bar";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
// import { BlurView } from "expo-blur";

function Page() {
  const { runTransaction, clearTransaction, balance, transactions } =
    useFintech();

  function handleAddMoney() {
    const transaction = {
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date().toISOString(),
      title: "Added money",
    };
    runTransaction(transaction);
  }

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background, paddingVertical: 50 }}
    >
      <StatusBar style="dark" />
      {/* account balance */}
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>

      {/* account actions */}
      <View style={styles.accountActions}>
        <RoundButton name="add" text="Add Money" onPress={handleAddMoney} />
        <RoundButton
          name="refresh"
          text="Exchange"
          onPress={clearTransaction}
        />
        <RoundButton name="list" text="Details" onPress={() => {}} />
        <DropDownMenu />
      </View>

      {/* transactions */}
      <Text style={styles.Title}>Transactions</Text>
      <View style={styles.transactionsContainer}>
        {transactions.length === 0 && (
          <Text style={{ color: Colors.gray, fontSize: 15 }}>
            No transactions yet
          </Text>
        )}
        {transactions.map((transaction) => (
          <View style={styles.transaction} key={transaction.id}>
            <View style={styles.leftSideTransaction}>
              <RoundButton
                type="smallBtn"
                name={transaction.amount > 0 ? "add" : "remove"}
              />
              <View>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <Text style={styles.transactionCurrency}>
              {transaction.amount}€
            </Text>
          </View>
        ))}
      </View>

      {/* dragable list */}
      <View style={{paddingBottom:50}}>
        <Text style={[styles.Title, { marginBottom: 15 }]}>Widgets</Text>
        <WidgetList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  balance: {
    fontSize: 40,
    fontWeight: "700",
  },
  currency: {
    fontSize: 20,
    fontWeight: "700",
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  Title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 40,
    paddingHorizontal: 15,
  },
  transactionsContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    gap: 20,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSideTransaction: {
    flexDirection: "row",
    gap: 10,
  },
  transactionTitle: {
    fontWeight: "600",
    fontSize: 15,
  },
  transactionCurrency: { fontSize: 17, fontWeight: "500" },
  transactionDate: {
    color: Colors.gray,
  },
});
export default Page;
