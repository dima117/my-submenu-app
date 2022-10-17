import "./App.css";
import { Menu } from "./components/Menu";
import { MenuItemRenderer } from "./components/MenuItem";
import { TmpMenuAnyItem } from "./interfaces";

const items: TmpMenuAnyItem[] = [
  { type: "option", text: "Корова", hint: "животное", value: "1" },
  { type: "option", text: "Мышь", hint: "животное", value: "2" },
  {
    type: "section",
    key: "geo",
    text: "География (секция)",
    items: [
      { type: "option", text: "Европа", value: "7-1" },
      { type: "option", text: "Азия", value: "7-2" },
      { type: "option", text: "Африка", value: "7-3" },
      { type: "option", text: "Америка", value: "7-4" },
    ],
  },
  { type: "option", text: "Окунь", hint: "рыба", value: "3" },
  { type: "option", text: "Шиповник", hint: "растение", value: "4" },
  {
    type: "menu",
    text: "Инструменты →",
    key: "5",
    items: [
      { type: "option", text: "DDD-51", value: "5-1" },
      { type: "option", text: "DDD-52", value: "5-2" },
      { type: "option", text: "DDD-53", value: "5-3" },
      { type: "option", text: "DDD-54", value: "5-4" },
    ],
  },
  { type: "link", text: "GO GO GO", hint: 'сылка', url: "http://ya.ru", key: "6" },
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
