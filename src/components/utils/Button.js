import styled from "styled-components";
import IconButton from '@mui/material/IconButton';

export default styled(IconButton)`
  && {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.background}
  }
`;