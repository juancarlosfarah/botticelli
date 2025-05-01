import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

import AssignmentIcon from '@mui/icons-material/Assignment';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import ScienceIcon from '@mui/icons-material/Science';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import RobotIcon from '@mui/icons-material/SmartToy';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import GlobalStyles from '@mui/joy/GlobalStyles';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import { closeSidebar } from '../utils';
import ColorSchemeToggle from './ColorSchemeToggle';
import Toggler from './layout/Toggler';
import { logoutUser, selectCurrentUser } from './user/UsersSlice';

export default function Sidebar(): ReactElement {
  const { pathname } = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = (): void => {
    dispatch(logoutUser());
    navigate('/home');
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: 'fixed',
          md: 'sticky',
        },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={(): void => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <RobotIcon />
        </IconButton>
        <Typography level="title-lg">Botticelli</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder={t('Search')}
      />

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={pathname === '/home'}
              role="menuitem"
              component={Link}
              to="/home"
            >
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">{t('Home')}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={pathname === '/experiments'}
              role="menuitem"
              component={Link}
              to="/experiments"
            >
              <ScienceIcon />
              <ListItemContent>
                <Typography level="title-sm">{t('Experiments')}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={pathname === '/simulations'}
              role="menuitem"
              component={Link}
              to="/simulations"
            >
              <ImportantDevicesIcon />
              <ListItemContent>
                <Typography level="title-sm">Simulations</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }): ReactElement => (
                <ListItemButton onClick={(): void => setOpen(!open)}>
                  <AssignmentIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Interactions</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                {/*<ListItemButton*/}
                {/*  sx={{ mt: 0.5 }}*/}
                {/*  selected={pathname === '/interactions'}*/}
                {/*  role="menuitem"*/}
                {/*  component={Link}*/}
                {/*  to="/interactions"*/}
                {/*>*/}
                {/*  <ListItemContent>*/}
                {/*    <Typography level="body-sm">Interactions</Typography>*/}
                {/*  </ListItemContent>*/}
                {/*</ListItemButton>*/}
                <ListItemButton
                  sx={{ mt: 0.5 }}
                  selected={pathname === '/interactions/templates'}
                  role="menuitem"
                  component={Link}
                  to="/interactions/templates"
                >
                  <ListItemContent>
                    <Typography level="body-sm">{t('Templates')}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </List>
            </Toggler>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }): ReactElement => (
                <ListItemButton onClick={(): void => setOpen(!open)}>
                  <QuestionAnswerRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">{t('Exchanges')}</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                {/*<ListItemButton*/}
                {/*  sx={{ mt: 0.5 }}*/}
                {/*  selected={pathname === '/exchanges'}*/}
                {/*  role="menuitem"*/}
                {/*  component={Link}*/}
                {/*  to="/exchanges"*/}
                {/*>*/}
                {/*  <ListItemContent>*/}
                {/*    <Typography level="body-sm">Exchanges</Typography>*/}
                {/*  </ListItemContent>*/}
                {/*</ListItemButton>*/}
                <ListItemButton
                  sx={{ mt: 0.5 }}
                  selected={pathname === '/exchanges/templates'}
                  role="menuitem"
                  component={Link}
                  to="/exchanges/templates"
                >
                  <ListItemContent>
                    <Typography level="body-sm">{t('Templates')}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </List>
            </Toggler>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={pathname === '/triggers'}
              role="menuitem"
              component={Link}
              to="/triggers"
            >
              <ElectricBoltIcon />
              <ListItemContent>
                <Typography level="title-sm">{t('Triggers')}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }): ReactElement => (
                <ListItemButton onClick={(): void => setOpen(!open)}>
                  <GroupRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Agents</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem nested>
                  <Toggler
                    renderToggle={({ open, setOpen }): ReactElement => (
                      <ListItemButton onClick={(): void => setOpen(!open)}>
                        <RobotIcon />
                        <ListItemContent>
                          <Typography level="title-sm">
                            {t('Artificial')}
                          </Typography>
                        </ListItemContent>
                        <KeyboardArrowDownIcon
                          sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                        />
                      </ListItemButton>
                    )}
                  >
                    <List sx={{ gap: 0.5 }}>
                      <ListItemButton
                        sx={{ mt: 0.5 }}
                        selected={pathname === '/agents/artificial/assistants'}
                        role="menuitem"
                        component={Link}
                        to="/agents/artificial/assistants"
                      >
                        <ListItemContent>
                          <Typography level="body-sm">Assistants</Typography>
                        </ListItemContent>
                      </ListItemButton>
                      <ListItemButton
                        sx={{ mt: 0.5 }}
                        selected={pathname === '/agents/artificial/evaluators'}
                        role="menuitem"
                        component={Link}
                        to="/agents/artificial/evaluators"
                      >
                        <ListItemContent>
                          <Typography level="body-sm">
                            {t('Evaluators')}
                          </Typography>
                        </ListItemContent>
                      </ListItemButton>
                      <ListItemButton
                        sx={{ mt: 0.5 }}
                        selected={
                          pathname === '/agents/artificial/participants'
                        }
                        role="menuitem"
                        component={Link}
                        to="/agents/artificial/participants"
                      >
                        <ListItemContent>
                          <Typography level="body-sm">Participants</Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </List>
                  </Toggler>
                </ListItem>

                <ListItem nested>
                  <Toggler
                    renderToggle={({ open, setOpen }): ReactElement => (
                      <ListItemButton onClick={(): void => setOpen(!open)}>
                        <GroupRoundedIcon />
                        <ListItemContent>
                          <Typography level="title-sm">{t('Human')}</Typography>
                        </ListItemContent>
                        <KeyboardArrowDownIcon
                          sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                        />
                      </ListItemButton>
                    )}
                  >
                    <List sx={{ gap: 0.5 }}>
                      <ListItemButton
                        sx={{ mt: 0.5 }}
                        selected={pathname === '/agents/human/assistants'}
                        role="menuitem"
                        component={Link}
                        to="/agents/human/assistants"
                      >
                        <ListItemContent>
                          <Typography level="body-sm">Assistants</Typography>
                        </ListItemContent>
                      </ListItemButton>
                      <ListItemButton
                        sx={{ mt: 0.5 }}
                        selected={pathname === '/agents/human/participants'}
                        role="menuitem"
                        component={Link}
                        to="/agents/human/participants"
                      >
                        <ListItemContent>
                          <Typography level="body-sm">Participants</Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </List>
                  </Toggler>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={pathname === '/support'}
              role="menuitem"
              component={Link}
              to="/support"
            >
              <SupportRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Support</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={pathname === '/settings'}
              role="menuitem"
              component={Link}
              to="/settings"
            >
              <SettingsRoundedIcon />
              {t('Settings')}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar variant="outlined" size="sm" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">
            {currentUser ? currentUser.split('@')[0] : 'Guest'}
          </Typography>
          <Typography
            level="body-xs"
            component={Link}
            to="/login"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {currentUser || 'Click to sign in'}
          </Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
