import { Link as RouterLink } from 'react-router-dom';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

type Props = {
  entityName: string;
};

const CustomBreadcrumbs = ({ entityName }: Props) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            aria-label="Home"
            component={RouterLink}
            to="/"
          >
            <HomeRoundedIcon />
          </Link>
          {/*<Link*/}
          {/*  underline="hover"*/}
          {/*  color="neutral"*/}
          {/*  component={RouterLink}*/}
          {/*  fontSize={12}*/}
          {/*  fontWeight={500}*/}
          {/*  to="/"*/}
          {/*>*/}
          {/*  Dashboard*/}
          {/*</Link>*/}
          {/*<Typography color="primary" fontWeight={500} fontSize={12}>*/}
          {/*  {entityName}*/}
          {/*</Typography>*/}
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default CustomBreadcrumbs;
