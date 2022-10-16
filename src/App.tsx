import "./App.css";
import { Item } from "react-stately";

import { Menu, MenuItemRenderer } from "./Menu";
import { TmpMenuItem } from "./interfaces";

const items: TmpMenuItem[] = [
  { type: "option", text: "Корова", hint: 'Животное', value: "1" },
  { type: "option", text: "Мышь", hint: 'Животное', value: "2" },
  { type: "option", text: "Окунь", hint: 'Рыба', value: "3" },
  { type: "option", text: "Шиповник", hint: 'Растение', value: "4" },
  {
    type: "menu",
    text: "Инструменты",
    key: "5",
    items: [
        { type: "option", text: "DDD-51", value: "5-1" },
        { type: "option", text: "DDD-52", value: "5-2" },
        { type: "option", text: "DDD-53", value: "5-3" },
        { type: "option", text: "DDD-54", value: "5-4" },
    ],
  },
  { type: "link", text: "GO GO GO", url: "http://ya.ru", key: "6" },
];

function App() {
  return (
    <div className="App">
      moo
      <div>
        <Menu>
          <Item>111</Item>
          <Item>222</Item>
          <Item>333</Item>
        </Menu>

        <Menu items={items}>{MenuItemRenderer}</Menu>
      </div>
    </div>
  );
}

export default App;
