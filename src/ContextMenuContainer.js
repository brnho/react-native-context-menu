import { View, Animated } from "react-native";
import React, { useState, useRef, useContext } from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import PortalContainer from "./PortalContainer";
import BackgroundContext from "./BackgroundContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight);

const ContextMenuContainer = ({ marginTop=0, marginRight=0, marginBottom=0, marginLeft=0, menuItems, children }) => {
    const { setScrollEnabled } = useContext(BackgroundContext);
    const [showPortal, setShowPortal] = useState(false);
    const [dimensions, setDimensions] = useState({
        x: null,
        y: null,
        width: null,
        height: null,
    });

    const handleLongPress = () => {
        // prevent flatlist from scrolling 
        setScrollEnabled(false);
        // measure dimensions of child element
        view.current.measure((fx, fy, width, height, px, py) => {
            setDimensions({
                x: px,
                y: py,
                width: width,
                height: height,
            });
        });
        // display portal wrapped child
        setShowPortal(true);
    };

    const view = useRef();

    return (
        <>
            {/* Wrap child in View to be able to measure dimensions */}
            <View
                ref={view}
                style={{
                    marginTop: marginTop,
                    marginRight: marginRight,
                    marginBottom: marginBottom,
                    marginLeft: marginLeft,
                    // hide child if portal child is being displayed
                    opacity: showPortal ? 0 : 1,
                }}
            >
                <AnimatedTouchable
                    activeOpacity={0.8}
                    style={{ borderRadius: 5 }}
                    delayLongPress={350}
                    onLongPress={showPortal ? null : handleLongPress}
                >
                    {children}
                </AnimatedTouchable>
            </View>

            {/* Render a duplicate, portal-wrapped child upon longPress */}
            {showPortal && (
                <PortalContainer
                    dimensions={dimensions}
                    showPortal={showPortal}
                    setShowPortal={setShowPortal}
                    menuItems={menuItems}
                >
                    {children}
                </PortalContainer>
            )}
        </>
    );
};

export default ContextMenuContainer;
