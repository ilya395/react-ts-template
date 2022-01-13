import React from "react";
import "./styles/styles.scss";
import cn from "classnames";
import s from "./App.module.scss";

const App: React.FC = () => (
  <div className={cn(s["main-title"])}>
    Это функциональный компонент! лол!!
  </div>
);

export default App;