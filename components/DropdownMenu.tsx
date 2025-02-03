import * as DropdownMenu from "zeego/dropdown-menu";
import RoundButton from "./RoundButton";

function DropDownMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <RoundButton name="ellipsis-horizontal" text="more" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="statement">
          <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{ name: "list.bullet.rectangle.fill", pointSize: 24 }}
          />
        </DropdownMenu.Item>

        <DropdownMenu.Item key="converter">
          <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{ name: "coloncurrencysign.arrow.circlepath", pointSize: 24 }}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="background">
          <DropdownMenu.ItemTitle>background</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "photo.fill", pointSize: 24 }} />
        </DropdownMenu.Item>

        <DropdownMenu.Item key="account">
          <DropdownMenu.ItemTitle>Add new account</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{ name: "plus.rectangle.fill.on.folder.fill", pointSize: 24 }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default DropDownMenu;
