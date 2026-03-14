import React from "react";
import { registerRootComponent } from "expo";
import { AppNavigator } from "./AppNavigator";

const Root = () => {
  return <AppNavigator />;
};

registerRootComponent(Root);

