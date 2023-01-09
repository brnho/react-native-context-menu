# react-native-context-menu

React Native implementation of iOS context menu - replicates the full set of animations (bounce, haptics, background shrink and blur, etc.), and provides extensive support for customization of menu items and animations.

https://user-images.githubusercontent.com/17365107/211397217-63fa501c-481e-4434-9e52-1e8b491f21c9.mov

## Setup 
The library is available on npm. Install with `npm i @brnho/react-native-context-menu` or `yarn add @brnho/react-native-context-menu`.

## Usage
First, wrap the root view of your app with `ContextMenuProvider`.
```javascript
import { ContextMenuProvider, ContextMenuContainer } from "@brnho/react-native-context-menu";

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
Then, wrap the component that you want to provide a context menu to with `ContextMenuContainer`.
```javascript
const ListItem = ({ item }) => {
  return (
    <ContextMenuContainer menuItems={menuItems}>
      <View style={styles.listItem}>
        <Text>Item {item.num}</Text>
      </View>
    </ContextMenuContainer>
  );
};
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
## Props
### `ContextMenuProvider` Props
| Name | Type | Default | Required | Description |
| -- | -- | -- | -- | -- |
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
#### `menuItems`
`menuItems` is an array of objects, each representing an item of the context menu. The fields of a menu item object are as follows:

| Name | Type | Required | Description |
| -- | -- | -- | -- | 
| text | string | Yes | Menu item text | 
| iconType | string | Yes | Icon family (must be one of 'AntDesign', 'Entypo', 'Feather', <br> 'FontAwesome5', 'Ionicons', 'MaterialIcons') | 
| iconName | string | Yes | Name of icon | 
| iconSize | number | Yes | Size of icon | 
| onPress | function | No | Function to be called when the menu item is pressed | 
| isTitle | string | No | Applies different styling to a menu item designated as the title | 
| isDestructive | boolean | No | Colors text and icon of item in red | 

*Additional documentation and features coming soon*
