import React from "react";
import { TouchableOpacity, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "components";

function CategoryItem({ item, index, onpress }) {
    return (
        <TouchableOpacity
            style={[
                { width: 80, height: 60, borderRadius: 3, marginTop: 5, marginBottom: 15 },
                index == 0 ? { marginStart: 12, marginEnd: 10 } : { marginEnd: 10 },
            ]} onPress={() => onpress(item.id)}>
            <ImageBackground
                source={{
                    uri: item.image ? item.image.src : "https://source.unsplash.com/1600x900/?" + item.name,
                }}
                style={{ width: 80, height: 60, flex: 1, borderRadius: 3 }} resizeMode="cover">
                <LinearGradient
                    colors={["#afafaf5e", "#000000ff"]}
                    style={{ position: "absolute", width: "100%", bottom: 0 }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 10, paddingVertical: 2, fontWeight: "700" }}>{item.name.toUpperCase()}</Text>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    )
}

export default CategoryItem;