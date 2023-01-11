import { StyleSheet, Animated, Pressable, Dimensions } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { BlurView } from "expo-blur";
import { Portal } from "@gorhom/portal";
import ContextMenu from "./ContextMenu.js";
import * as Haptics from "expo-haptics";
import BackgroundContext from "./BackgroundContext";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);


const PortalContainer = ({ dimensions, setShowPortal, menuItems, borderRadius, children }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const {
        shrinkScreenAnimation,
        restoreScreenAnimation,
        setScrollEnabled,
        EXPAND_FACTOR,
        FADE_SPEED,
        APPEAR_SPEED,
        BLUR_INTENSITY,
        MENU_ITEM_HEIGHT,
        DIVIDER_HEIGHT,
        MENU_WIDTH,
        MENU_MARGIN,
    } = useContext(BackgroundContext);

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const blurAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0.2)).current;

    const shrinkBookAnimation = Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });
    const expandBookAnimation = Animated.timing(scaleAnim, {
        toValue: EXPAND_FACTOR,
        duration: APPEAR_SPEED,
        useNativeDriver: true,
    });
    const restoreBookAnimation = Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });
    const blurAnimation = Animated.timing(blurAnim, {
        toValue: BLUR_INTENSITY,
        duration: APPEAR_SPEED,
        useNativeDriver: false,
    });
    const undoBlurAnimation = Animated.timing(blurAnim, {
        toValue: 0,
        duration: FADE_SPEED,
        useNativeDriver: false,
    });
    const translateAnimation = Animated.timing(translateAnim, {
        toValue: boundaryTranslation,
        duration: APPEAR_SPEED,
        useNativeDriver: true,
    });
    const undoTranslateAnimation = Animated.timing(translateAnim, {
        toValue: 0,
        duration: FADE_SPEED,
        useNativeDriver: true,
    });
    const opacityAnimation = Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
    });

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [scaleDimensions, setScaleDimensions] = useState({
        x: null,
        y: null,
        width: null,
        height: null,
    });
    const [boundaryTranslation, setBoundaryTranslation] = useState(0);
    const [childAnimation, setChildAnimation] = useState({});
    const [menuPosition, setMenuPosition] = useState({ x: null, y: null });
    const view = useRef();
    const timerRef = useRef(null);

    const bounce = () => {
        shrinkBookAnimation.start(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            Animated.parallel([
                expandBookAnimation,
                opacityAnimation
            ]).start(() => {
                // measure dimensions of expanded child element
                view.current.measure((fx, fy, width, height, px, py) => {
                    setScaleDimensions({ x: px, y: py, width: width, height: height });
                })
            });
        });
    };

    const backgroundAnimations = () => {
        Animated.parallel([
            blurAnimation,
            translateAnimation,
            shrinkScreenAnimation,
        ]).start();
    };

    // If closePortal is called directly from ContextMenu, then we must pass in ContextMenu's animations
    // This is because on state change, ContextMenu's version of closePortal does not update
    const closePortal = (childShrinkAnimation = null, childFadeAnimation = null) => {
        Animated.parallel([
            childShrinkAnimation,
            childFadeAnimation,
            childAnimation.shrinkAnimation,
            childAnimation.fadeAnimation,
            undoBlurAnimation,
            restoreBookAnimation,
            undoTranslateAnimation,
            restoreScreenAnimation,
        ]).start(() => {
            setScrollEnabled(true);
            setShowPortal(false);
        });
    };

    useEffect(() => {
        bounce();
    }, []);

    // Clear the interval when the component unmounts
    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    // once expansion animation has finished, blur + shrink background and display context menu
    useEffect(() => {
        if (scaleDimensions.x !== null) {
            const menuHeight = menuItems.length * MENU_ITEM_HEIGHT + (menuItems.length - 1) * DIVIDER_HEIGHT;
            // determine whether the menu should be positioned above or below the element
            const aboveYDistance = Math.abs(scaleDimensions.y - MENU_MARGIN - windowHeight/2);
            const belowYDistance = Math.abs(scaleDimensions.y + scaleDimensions.height + MENU_MARGIN - windowHeight/2)
            let menuY;
            if (aboveYDistance < belowYDistance) {
                menuY = scaleDimensions.y - MENU_MARGIN - menuHeight;
            } else {
                menuY = scaleDimensions.y + scaleDimensions.height + MENU_MARGIN
            }
            // determine whether the menu should be aligned with the left or right border of the element
            const leftXDistance = Math.abs(scaleDimensions.x - windowWidth/2)
            const rightXDistance = Math.abs(scaleDimensions.x + scaleDimensions.width - windowWidth/2)
            let menuX;
            if (leftXDistance >= rightXDistance) {
                menuX = scaleDimensions.x
            } else {
                menuX = scaleDimensions.x + scaleDimensions.width - MENU_WIDTH;
            }
            setMenuPosition({ x: menuX, y: menuY });
            timerRef.current = setTimeout(() => {
                backgroundAnimations();
                setShowContextMenu(true);
            }, 100);
        }
    }, [scaleDimensions]);

    const portalStyle = {
        position: "absolute",
        left: dimensions.x,
        top: dimensions.y,
        transform: [{ scale: scaleAnim }, { translateY: 0 }],
    };

    const opacityViewStyle = {
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "black",
        opacity: opacityAnim,
        height: dimensions.height,
        width: dimensions.width,
        borderRadius: borderRadius,
    }

    return (
        <Portal>
            {/* Background Blur */}
            <Pressable style={{ ...StyleSheet.absoluteFill }} onPress={() => closePortal()}>
                <AnimatedBlurView
                    intensity={blurAnim}
                    style={{ flex: 1 }}
                    tint="dark"
                />
            </Pressable>

            {/* Child Element */}
            <Animated.View ref={view} style={portalStyle}>
                {children}
                <Animated.View style={opacityViewStyle} />
            </Animated.View>

            {/* Context Menu */}
            {showContextMenu && (
                <ContextMenu
                    menuItems={menuItems}
                    menuPosition={menuPosition}
                    setChildAnimation={setChildAnimation}
                    boundaryTranslation={boundaryTranslation}
                    closePortal={closePortal}
                />
            )}
        </Portal>
    );
};

export default PortalContainer;
