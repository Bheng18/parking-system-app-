import Button from "@mui/material/Button"

const MuiButton = (props) => {
    const { children, variant, type, sx } = props;
  return(
    <Button type={type} variant={variant} sx={sx}>{children}</Button>
  )
}

export default MuiButton;