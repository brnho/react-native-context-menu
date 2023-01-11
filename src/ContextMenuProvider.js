import { Animated } from "react-native";
import React, { useRef } from "react";
import { PortalProvider } from "@gorhom/portal";
import BackgroundContext from "./BackgroundContext";

const ContextMenuProvider = ({
    setScrollEnabled,
    children,
    SCREEN_SHRINK_FACTOR = 0.97,
    EXPAND_FACTOR = 1.05,
    FADE_SPEED = 200,
    APPEAR_SPEED = 200,
    BLUR_INTENSITY = 30,
    MENU_ITEM_HEIGHT = 40,
    DIVIDER_HEIGHT = 1,
    MENU_WIDTH = 200,
    MENU_MARGIN = 7,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shrinkScreenAnimation = Animated.timing(scaleAnim, {
        toValue: SCREEN_SHRINK_FACTOR,
        duration: APPEAR_SPEED,
        useNativeDriver: true,
    });
    const restoreScreenAnimation = Animated.timing(scaleAnim, {
        toValue: 1,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });
    return (
        <BackgroundContext.Provider
            value={{
                shrinkScreenAnimation,
                restoreScreenAnimation,
                setScrollEnabled,
                SCREEN_SHRINK_FACTOR,
                EXPAND_FACTOR,
                FADE_SPEED,
                APPEAR_SPEED,
                BLUR_INTENSITY,
                MENU_ITEM_HEIGHT,
                DIVIDER_HEIGHT,
                MENU_WIDTH,
                MENU_MARGIN,
            }}
        >
            <PortalProvider>
                <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
                    {children}
                </Animated.View>
            </PortalProvider>
        </BackgroundContext.Provider>
    );
};

export default ContextMenuProvider;
