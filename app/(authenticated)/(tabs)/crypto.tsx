import Colors from "@/constants/Colors";
import { currencies, data } from "@/constants/data";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

function Page() {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight)

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {currencies.map((currency, index: any) => (
          <Link  href={`/crypto/${currency.id}`} asChild key={currency.id}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  source={{ uri: data[index].logo }}
                  style={{ height: 40, width: 40 }}
                />
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "500" }}>
                    {currency.name}
                  </Text>
                  <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                <Text style={{ fontWeight: "600" }}>
                  {currency.quote.EUR.price.toFixed(2)} €
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name={
                      currency.quote.EUR.percent_change_1h > 0
                        ? "caret-up"
                        : "caret-down"
                    }
                    size={16}
                    color={
                      currency.quote.EUR.percent_change_1h > 0 ? "green" : "red"
                    }
                  />
                  <Text
                    style={{
                      color:
                        currency.quote.EUR.percent_change_1h > 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {currency.quote.EUR.percent_change_1h.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

export default Page;
