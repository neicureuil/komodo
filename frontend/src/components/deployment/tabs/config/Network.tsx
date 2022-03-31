import { Component } from "solid-js";
import { combineClasses } from "../../../../util/helpers";
import Flex from "../../../util/layout/Flex";
import Selector from "../../../util/menu/Selector";
import s from "../../deployment.module.css";
import { useConfig } from "./Provider";

const Network: Component<{}> = (p) => {
  const { deployment, setDeployment, networks } = useConfig();
  return (
    <Flex
      class={combineClasses(s.ConfigItem, "shadow")}
      justifyContent="space-between"
    >
      <h1>network</h1>
      <Selector
        targetClass="blue"
        items={networks().map((net) => net.name)}
        selected={deployment.network || "bridge"}
        onSelect={(network) => setDeployment("network", network)}
        position="bottom right"
      />
    </Flex>
  );
};

export default Network;
