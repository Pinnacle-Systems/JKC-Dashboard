import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    useTheme
} from "@mui/material"
import { tokens } from "../theme"

const Item = ({ title, content }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    return (
        <Card
            sx={{
                background: 'white',
                boxShadow: 4,
                height: `100%`,
                width: "100%"
            }}
        >
            {/* <CardHeader
                title={
                    <Typography variant="h5" fontWeight={600}>
                        {title}
                    </Typography>
                }
            /> */}
            <CardContent
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.tableTop[100],
                        minHeight: "50px",
                        fontWeight: 'bold'
                    },
                }}
            >
                {content}
            </CardContent>
        </Card>
    )
}

export default Item
