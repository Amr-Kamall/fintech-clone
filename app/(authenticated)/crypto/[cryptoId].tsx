import Colors from "@/constants/Colors";
import { categories, currencies, data, tickers } from "@/constants/data";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function CryptoDetails() {
  const headerHeight = useHeaderHeight();
  const { cryptoId } = useLocalSearchParams();
  const [activeBtn, setActiveBtn] = useState(0);

  const selectdCrypto = currencies.find(
    (crrencyItem) => crrencyItem.id === +cryptoId
  );
  if (!selectdCrypto) {
    console.log("Crypto not found for id:", cryptoId);
    return <div>Crypto not found</div>;
  }

  // chart data
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const { state, isActive } = useChartPressState({ x: "", y: { price: 0 } });

  // make effect when click on chart
  useEffect(
    function () {
      console.log(isActive);
      if (isActive) Haptics.selectionAsync();
    },
    [isActive]
  );

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)}€`,
      defaultValue: "",
    };
  });

  const animatedDateProps = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: "",
    };
  });

  return (
    <Fragment>
      <Stack.Screen options={{ title: selectdCrypto.name }} />
      <SectionList
        style={{ marginTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        sections={[{ data: [{ title: "chart" }] }]}
        keyExtractor={(i) => i.title}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
              paddingHorizontal: 20,
              backgroundColor: Colors.background,
            }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveBtn(index)}
                style={
                  activeBtn === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
              >
                <Text
                  style={
                    activeBtn === index
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16,
                paddingVertical: 20,
              }}
            >
              <Text style={styles.subTitle}>{selectdCrypto.symbol}</Text>
              <Image
                source={{ uri: data[selectdCrypto.index].logo }}
                width={45}
                height={45}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primary,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={"#fff"} />
                <Text style={[defaultStyles.buttonText, { color: "#fff" }]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primaryMuted,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 300 }]}>
              {!isActive && (
                <View>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: Colors.dark,
                    }}
                  >
                    {tickers[tickers.length - 1].price.toFixed(2)}€
                  </Text>
                  <Text style={{ fontSize: 18, color: Colors.gray }}>
                    Today
                  </Text>
                </View>
              )}
              {isActive && (
                <View>
                  <AnimatedTextInput
                    animatedProps={animatedTextProps}
                    editable={false}
                    underlineColorAndroid={"transparent"}
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: Colors.dark,
                    }}
                  ></AnimatedTextInput>
                  <AnimatedTextInput
                    animatedProps={animatedDateProps}
                    editable={false}
                    underlineColorAndroid={"transparent"}
                    style={{ fontSize: 18, color: Colors.gray }}
                  ></AnimatedTextInput>
                </View>
              )}
              <CartesianChart
                chartPressState={state}
                data={tickers}
                xKey="timestamp"
                yKeys={["price"]}
                axisOptions={{
                  font,
                  tickCount: 5,
                  labelOffset: { x: -2, y: 0 },
                  formatYLabel: (v) => `${v} €`,
                  formatXLabel: (ms) =>
                    new Date(ms).toLocaleDateString("en-GB", {
                      month: "2-digit",
                      year: "2-digit",
                    }),
                }}
              >
                {({ points }) => (
                  <>
                    <Line
                      points={points.price}
                      color={Colors.primary}
                      strokeWidth={3}
                    />
                    {isActive ? (
                      <ToolTip
                        x={state.x.position}
                        y={state.y.price.position}
                      />
                    ) : null}
                  </>
                )}
              </CartesianChart>
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subTitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                Bitcoin is a decentralized digital currency, without a central
                bank or single administrator, that can be sent from user to user
                on the peer-to-peer bitcoin network without the need for
                intermediaries. Transactions are verified by network nodes
                through cryptography and recorded in a public distributed ledger
                called a blockchain.
              </Text>
            </View>
          </>
        )}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
});

export default CryptoDetails;
