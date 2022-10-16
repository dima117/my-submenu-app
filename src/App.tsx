import "./App.css";
import { Menu, MenuItemRenderer } from "./Menu";
import { TmpMenuAnyItem } from "./interfaces";

const items: TmpMenuAnyItem[] = [
  { type: "option", text: "Корова", hint: "Животное", value: "1" },
  { type: "option", text: "Мышь", hint: "Животное", value: "2" },
  {
    type: "section",
    key: "geo",
    text: "География",
    items: [
      { type: "option", text: "Европа", value: "7-1" },
      { type: "option", text: "Азия", value: "7-2" },
      { type: "option", text: "Африка", value: "7-3" },
      { type: "option", text: "Америка", value: "7-4" },
    ],
  },
  { type: "option", text: "Окунь", hint: "Рыба", value: "3" },
  { type: "option", text: "Шиповник", hint: "Растение", value: "4" },
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
        <Menu items={items}>{MenuItemRenderer}</Menu>
      </div>
    </div>
  );
}

export default App;
