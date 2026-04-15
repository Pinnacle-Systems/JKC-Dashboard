import React from 'react'
import { Box, Typography, Button, Avatar, Stack } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { getCommonParams } from '../../utils/hleper'
import { useGetFnameQuery } from '../../redux/service/user'
import { useState } from 'react'
import { useEffect } from 'react'
import { DropdownWithSearch } from "../../input/inputcomponent";
import FinYear from '../../components/FinYear'

const DashboardHeader = ({ selectedYear, setSelectedYear, finYear, selectMonths, setSelectMonths }) => {

    const [user, setUser] = useState(null)
    const params = getCommonParams()

    const { isSuperAdmin, employeeId } = params

    const { data: userName } = useGetFnameQuery({ params: { employeeId } })

    useEffect(() => {
        if (!isSuperAdmin && userName && userName.data && Array.isArray(userName.data)) {
            const usernameObj = userName.data.find((x) => x.userName)
            if (usernameObj) setUser(usernameObj.userName)
        }
    }, [isSuperAdmin, userName])

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                p: 1,paddingLeft:2,
                backgroundColor: '#fff'
            }}
        >
            {/* Left Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    alt="Adrian"
                    src="/images/avatars/1.png" // change to your avatar image path
                    sx={{ width: 40, height: 40 }}
                />
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Welcome Back, {user || "SuperAdmin"}<span style={{ fontSize: '1.2rem' }}>👋</span>
                    </Typography>
                </Box>
            </Box>

            {/* Right Section (Buttons) */}
            <Stack direction="row" spacing={2}>
                {/* FIN YEAR */}
                <DropdownWithSearch
                    options={finYear?.data || []}
                    labelField="finYear"
                    value={selectedYear}
                    setValue={setSelectedYear}
                />

                {/* MONTH */}
                <FinYear
                    selectedYear={selectedYear}
                    selectmonths={selectMonths}
                    setSelectmonths={setSelectMonths}
                />
                
            </Stack>
        </Box>
    )
}

export default DashboardHeader
