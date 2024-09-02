import { SignUp} from "@clerk/nextjs";
import { Container, Box, Typography } from "@mui/material";

export default function signUpPage() {

    return (
        <Container maxWidth="sm">
            <Box
            margin={'20px'}
            display='flex'
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            >
                <Typography variant="h5" gutterBottom>
                    Sign-Up
                </Typography>
                <SignUp/>
            </Box>
        </Container>

    )
}