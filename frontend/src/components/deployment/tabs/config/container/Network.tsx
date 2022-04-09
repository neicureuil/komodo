import { Component } from "solid-js";
import Flex from "../../../../util/layout/Flex";
import Selector from "../../../../util/menu/Selector";
import { useConfig } from "../Provider";

const Network: Component<{}> = (p) => {
  const { deployment, setDeployment, networks, userCanUpdate } = useConfig();
  return (
    <Flex class="config-item shadow" justifyContent="space-between" alignItems="center">
      <h1>network</h1>
      <Selector
        targetClass="blue"
        items={networks().map((net) => net.name)}
        selected={deployment.network || "bridge"}
        onSelect={(network) => setDeployment("network", network)}
        position="bottom right"
        disabled={!userCanUpdate()}
        useSearch
      />
    </Flex>
  );
};

export default Network;
