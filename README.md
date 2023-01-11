# react-native-context-menu

React Native implementation of iOS context menu - replicates the full set of animations (bounce, haptics, background shrink and blur, etc.), and provides extensive support for customization of menu items and animations.

https://user-images.githubusercontent.com/17365107/211397217-63fa501c-481e-4434-9e52-1e8b491f21c9.mov

## Setup 
The library is available on npm. Install with `npm i @brnho/react-native-context-menu` or `yarn add @brnho/react-native-context-menu`.

## Usage
First, wrap the root view of your app with `ContextMenuProvider`. Then, wrap the component that you want to provide a context menu to with `ContextMenuContainer`.

```javascript
import { ContextMenuProvider, ContextMenuContainer } from "@brnho/react-native-context-menu";

export default function App() {
  return (
    <ContextMenuProvider>
      <View style={styles.container}>
        <ContextMenuContainer menuItems={menuItems}>
          <MyExampleComponent />
        </ContextMenuContainer
      </View>
    </ContextMenuProvider>
  );
}
```
You can customize the context menu via the `menuItems` prop of `ContextMenuContainer`. For example:
```javascript
const menuItems = [
  { text: "Action", isTitle: true },
  {
    text: "Edit",
    icon: {
      type: "Feather",
      name: "edit",
      size: 18,
    },
    onPress: () => {
      alert("Edit pressed");
    },
  },
  {
    text: "Delete",
    icon: {
      type: "Feather",
      name: "trash",
      size: 18,
    },
    withSeparator: true,
    isDestructive: true,
    onPress: () => {
      alert("Delete pressed");
    },
  },
];
```
## Tips/Caveats
- For the positioning of the animations to work properly, do not apply any margins to the target component. Instead, apply margins directly to the `ContextMenuContainer` wrapper via the margin props (see [Props](#props) section).

- If your target component has a nonzero border radius, then apply the same amount of border radius to `ContextMenuContainer` via the `borderRadius` prop. This ensures that `ContextMenuContainer` precisely covers the component.

- If you are applying a context menu to an item in a Flatlist, to prevent the user from being able to scroll the list during a long press event, set the `setScrollEnabled` prop of `ContextMenuProvider` equal to a state function. For more details, refer to the following example:
```javascript
export default function App() {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  return (
    <ContextMenuProvider setScrollEnabled={setScrollEnabled}>
      <View style={styles.container}>
        <FlatList
          scrollEnabled={scrollEnabled}
          data={data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(_, index) => index}
        />
      </View>
    </ContextMenuProvider>
  );
}
```

## Props
### `ContextMenuProvider` Props
| Name | Type | Default | Required | Description |
| -- | -- | -- | -- | -- |
| setScrollEnabled | function | null | No | Function executed on long press to prevent user from being able to scroll |
| SCREEN_SHRINK_FACTOR | number | 0.97 | No | Amount by which to shrink the background when the component pops out |
| EXPAND_FACTOR | number | 1.05 | No | Amount by which to expand the component when it pops out |
| FADE_SPEED | number | 200 | No | Animation speed in MS of the component "un-popping" |
| APPEAR_SPEED | number | 200 | No | Animation speed in MS of the component popping out |
| BLUR_INTENSITY | number | 30 | No | Degree to which the background is blurred when the component pops out (value is in range [0, 100]) |
| MENU_ITEM_HEIGHT | number | 40 | No | Height of a single context menu item |
| DIVIDER_HEIGHT | number | 1 | No | Height of the dividers separating context menu items |
| MENU_WIDTH | number | 200 | No | Width of a single context menu item |
| MENU_MARGIN | number | 7 | No | Margin between the component and the context menu |

### `ContextMenuContainer` Props
| Name | Type | Required | Description |
| -- | -- | -- | -- | 
| marginTop | number | No | Amount of margin to apply to the top of the component |
| marginRight | number | No | Amount of margin to apply to the right of the component |
| marginBottom | number | No | Amount of margin to apply to the bottom of the component |
| marginLeft | number | No | Amount of margin to apply to the left of the component |
| borderRadius | number | No | Radius of component corners |
| menuItems | array | Yes | See below for additional details |

#### `menuItems` (See [Usage](#usage) section for an example)
`menuItems` is an array of objects, each representing an item of the context menu. The fields of a menu item object are as follows:

| Name | Type | Required | Description |
| -- | -- | -- | -- | 
| text | string | Yes | Menu item text | 
| icon | object | No | See below for additional details|
| onPress | function | No | Function to be called when the menu item is pressed | 
| isTitle | string | No | Applies different styling to a menu item designated as the title | 
| isDestructive | boolean | No | Colors text and icon of item in red | 

The `icon` prop is a object with the following fields:

| Name | Type | Required | Description |
| -- | -- | -- | -- | 
| type | string | Yes | Icon family (must be one of 'AntDesign', 'Entypo', 'Feather', <br> 'FontAwesome5', 'Ionicons', 'MaterialIcons') | 
| name | string | Yes | Name of icon | 
| size | number | Yes | Size of icon | 

(See https://icons.expo.fyi/ for a list of icon types and names)
