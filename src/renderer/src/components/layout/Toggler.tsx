import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import Box from '@mui/joy/Box';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
}): ReactElement {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default Toggler;
