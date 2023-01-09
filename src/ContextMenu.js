import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useContext, useState } from "react";
import * as Icons from "@expo/vector-icons";
import BackgroundContext from "./BackgroundContext";

const ContextMenu = ({
    menuItems,
    menuPosition,
    setChildAnimation,
    closePortal,
}) => {
    const {
        FADE_SPEED,
        APPEAR_SPEED,
        MENU_ITEM_HEIGHT,
        DIVIDER_HEIGHT,
        MENU_WIDTH,
    } = useContext(BackgroundContext);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const expandAnimation = Animated.timing(scaleAnim, {
        toValue: 1,
        duration: APPEAR_SPEED,
        useNativeDriver: true,
    });
    const shrinkAnimation = Animated.timing(scaleAnim, {
        toValue: 0,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });
    const opaqueAnimation = Animated.timing(opacityAnim, {
        toValue: 1,
        duration: APPEAR_SPEED,
        useNativeDriver: true,
    });
    const fadeAnimation = Animated.timing(opacityAnim, {
        toValue: 0,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });

    useEffect(() => {
        expandAnimation.start();
        opaqueAnimation.start();
        // send animations to parent component
        setChildAnimation({ shrinkAnimation, fadeAnimation });
    }, []);

    const positionStyle = {
        position: "absolute",
        left: menuPosition.x,
        top: menuPosition.y,
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }, { translateY: 0 }],
    };

    const [menu, setMenu] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const getIcon = (iconObj, red) => {
        let icon;
        switch (iconObj?.type) {
            case "AntDesign":
                icon = (
                    <Icons.AntDesign
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
            case "Entypo":
                icon = (
                    <Icons.Entypo
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
            case "Feather":
                icon = (
                    <Icons.Feather
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
            case "FontAwesome5":
                icon = (
                    <Icons.FontAwesome5
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
            case "Ionicons":
                icon = (
                    <Icons.Ionicons
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
            case "MaterialIcons":
                icon = (
                    <Icons.MaterialIcons
                        name={iconObj.name}
                        size={iconObj.size}
                        color={red ? "red" : "black"}
                    />
                );
                break;
        }
        return icon;
    };

    const handlePress = (onPressFn) => {
        // prevent double tapping
        setDisabled(true);
        closePortal(shrinkAnimation, fadeAnimation);
        setTimeout(() => onPressFn(), 200);
    };

    const getMenu = () => {
        const menu = menuItems.map((item, i) => {
            if (item.isTitle) {
                return (
                    <View key={i}>
                        <View style={[styles.menuHeader, { height: MENU_ITEM_HEIGHT }]}>
                            <Text style={{ color: "hsl(0, 0%, 40%)" }}>{item.text}</Text>
                        </View>
                        <View style={[styles.divider, { height: DIVIDER_HEIGHT }]} />
                    </View>
                );
            }
            return (
                <View key={i}>
                    <TouchableOpacity
                        style={[styles.menuItem, { height: MENU_ITEM_HEIGHT }]}
                        onPress={() => handlePress(item.onPress)}
                        disabled={disabled}
                    >
                        <Text
                            style={[
                                styles.menuText,
                                { color: item.isDestructive ? "red" : "black" },
                            ]}
                        >
                            {item.text}
                        </Text>
                        {getIcon(item.icon, item.isDestructive)}
                    </TouchableOpacity>
                    {i < menuItems.length - 1 ? <View style={[styles.divider, { height: DIVIDER_HEIGHT }]} /> : null}
                </View>
            );
        });
        return menu;
    };

    useEffect(() => {
        setMenu(getMenu());
    }, [disabled]);

    return (
        <Animated.View style={[styles.menu, positionStyle, { width: MENU_WIDTH }]}>{menu}</Animated.View>
    );
};

export default ContextMenu;

const styles = StyleSheet.create({
    menu: {
        backgroundColor: "hsl(0, 0%, 97%)",
        borderRadius: 10,
        justifyContent: "space-between",
    },
    menuHeader: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    menuText: {
        fontSize: 15,
    },
    divider: {
        backgroundColor: "hsl(0, 0%, 90%)",
    },
});
