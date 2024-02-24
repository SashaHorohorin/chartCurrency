import React, { useState } from 'react';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';

const items: string[] = ['$', '€', '¥'];
const ChoiceGroupCurrencies = ():JSX.Element => {
  const [value, setValue] = useState<string | null>(items[0]);
  return (
    <ChoiceGroup
      value={value}
      onChange={({value}) => setValue(value)}
      name="ChoiceGroupCurrencies"
      items={items}
      getItemLabel={(item) => item}
      multiple={false}
      size={'xs'}
    />
  );
};

export default ChoiceGroupCurrencies;