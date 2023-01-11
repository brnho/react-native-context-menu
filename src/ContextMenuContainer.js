import { View, Pressable } from "react-native";
import React, { useState, useRef, useContext } from "react";
import PortalContainer from "./PortalContainer";
import BackgroundContext from "./BackgroundContext";

const ContextMenuContainer = ({
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    borderRadius = 0,
    menuItems,
    children,
}) => {
    const { setScrollEnabled } = useContext(BackgroundContext);
    const [showPortal, setShowPortal] = useState(false);
    const [dimensions, setDimensions] = useState({
        x: null,
        y: null,
        width: null,
        height: null,
    });
    const [showOverlay, setShowOverlay] = useState(false);

    const handlePressIn = () => {
        // prevent re-measuring and thus re-rendering if user continues swiping around after long press
        if (!showPortal) {
            view.current.measure((fx, fy, width, height, px, py) => {
                setDimensions({
                    x: px,
                    y: py,
                    width: width,
                    height: height,
                });
            });
            setShowOverlay(true);
        }
    };

    const handlePressOut = () => {
        setShowOverlay(false);
    };

    const handleLongPress = () => {
        // prevent flatlist from scrolling
        if(setScrollEnabled) {
            setScrollEnabled(false);
        }
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
                <Pressable
                    style={{ borderRadius: borderRadius }}
                    delayLongPress={350}
                    onLongPress={showPortal ? null : handleLongPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    {children}
                </Pressable>
                {/* cover child with dark tinted overlay when pressed */}
                {showOverlay ? (
                    <View
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: dimensions.height,
                            width: dimensions.width,
                            backgroundColor: "black",
                            opacity: 0.2,
                            borderRadius: borderRadius,
                        }}
                    />
                ) : null}
            </View>

            {/* Render a duplicate, portal-wrapped child upon longPress */}
            {showPortal && (
                <PortalContainer
                    dimensions={dimensions}
                    showPortal={showPortal}
                    setShowPortal={setShowPortal}
                    menuItems={menuItems}
                    borderRadius={borderRadius}
                >
                    {children}
                </PortalContainer>
            )}
        </>
    );
};

export default ContextMenuContainer;
