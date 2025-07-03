{/* <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{fontSize: "18px", fontWeight: 500 }}>All Disclosures</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography color="text.secondary">Sort By</Typography>
                <Select
                 value="all"
                 size="small"
                 sx={{
                   minWidth: 100,
                   boxShadow: commonBoxShadow, 
                   border: 'none', 
                   height: commonHeight,
                   '& fieldset': {
                     border: 'none', 
                   },
                 }}
               >
                 <MenuItem value="all">All</MenuItem>
               </Select>
              </Box>
            </Box>
    
            <TableContainer sx={{ boxShadow: commonBoxShadow }}>
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: '#F8FAFC', 
                    '& .MuiTableCell-root': {
                      textTransform: 'uppercase', 
                      fontSize: '0.675rem',
                      fontWeight: 600,
                      color: '#64748B',
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>DIAMENTIONS</TableCell>
                    <TableCell>DISCLOSURE THEME</TableCell>
                    <TableCell>DISCLOSURE SUB TOPIC</TableCell>
                    <TableCell>DISCLOSURE DESCRIPTIONS</TableCell>
                    <TableCell>DISCLOSURE ID</TableCell>
                    <TableCell>RISK CATEGORY</TableCell>
                    <TableCell>ADD TO REPORT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { 
                      risk: "Both",
                      subTopic: "Operations and suppliers at significant risk for incidents of child labor",
                      description: "Operations and suppliers considered to have significant risk for incidents of: \n\n" +
                        "a. child labor; \n" +
                        "b. young workers exposed to hazardous work. \n\n" +
                        "Measures taken by the organization in the reporting period intended to contribute to the effective abolition of child labor."
                    },
                    { risk: "Positive" },
                    { risk: "Negative" }
                  ].map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        backgroundColor: selectedRows[index] === 'yes' ? 'rgba(20, 124, 101, 0.1)' : 'inherit',
                        '& .MuiTableCell-root': {
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      <TableCell sx={{color: "#147C65"}}>Social</TableCell>
                      
                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: "8px", boxShadow: commonBoxShadow, height: commonHeight,     backgroundColor: 'white !important' }}>
                        Child labor
                        </Box>
                        </TableCell>

                      <TableCell>
                        <Box 
                          onClick={() => handleDetailClick("Disclosure Sub Topic", row.subTopic)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            paddingLeft: "8px", 
                            boxShadow: commonBoxShadow, 
                            height: commonHeight,
                            backgroundColor: 'white !important',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#f5f5f5 !important'
                            }
                          }}
                        >
                          Operations & ...
                          <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box 
                          onClick={() => handleDetailClick("Disclosure Description", row.description)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            paddingLeft: "8px",  
                            boxShadow: commonBoxShadow, 
                            height: commonHeight,
                            backgroundColor: 'white !important',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#f5f5f5 !important'
                            }
                          }}
                        >
                          Operations & ...
                          <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                        </Box>
                      </TableCell>
                      <TableCell >
                      <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: "8px", boxShadow: commonBoxShadow, height: commonHeight,     backgroundColor: 'white !important' }}>
                        GRI 408-1
                        </Box>
                        </TableCell>
                      <TableCell>
                        <Select
                          value={row.risk.toLowerCase()}
                          size="small"
                          fullWidth
                          sx={{
                            boxShadow: commonBoxShadow, 
                            backgroundColor: 'white !important',
                            border: 'none', 
                            height: commonHeight,
                            '& fieldset': {
                              border: 'none', 
                            },
                          }}
                        >
                          <MenuItem value="both">Both</MenuItem>
                          <MenuItem value="positive">Positive</MenuItem>
                          <MenuItem value="negative">Negative</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          height: '100%',
                          width: '100%',
                          alignItems: 'center'
                        }}>
                          {showDropdowns[index] ? (
                            <Select
                              value={selectedRows[index] || 'no'} 
                              size="small"
                              onChange={(e) => handleYesNoChange(index, e.target.value)}
                              sx={{
                                width: '100px',
                                height: commonHeight,
                                boxShadow: commonBoxShadow,
                                ...(selectedRows[index] === 'yes' ? {
                                  backgroundColor: '#147C65',
                                  color: 'white',
                                  '& .MuiSvgIcon-root': {
                                    color: 'white',
                                  },
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                } : {
                                  backgroundColor: '#d32f2f',
                                  color: 'white',
                                  '& .MuiSvgIcon-root': {
                                    color: 'white',
                                  },
                                  '& fieldset': {
                                    border: 'none',
                                  },
                                })
                              }}
                            >
                              <MenuItem value="yes">Yes</MenuItem>
                              <MenuItem value="no">No</MenuItem>
                            </Select>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleButtonClick(index)}
                              sx={{
                                width: '100px',
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                height: commonHeight,
                                boxShadow: commonBoxShadow,
                                '&:hover': {
                                  borderColor: '#d32f2f',
                                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                }
                              }}
                            >
                              YES/NO
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
    
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 10 }}>
            <Button 
              variant="contained" 
              sx={{
                backgroundColor: "#147C65", 
                borderRadius: 1.5, 
                marginRight: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: "#147C65",
                }
              }}
            >
              + Add Disclosure
            </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleOpenEndedClick}
                sx={{
                  color: '#147C65',
                  borderColor: '#147C65',
                  textTransform: 'none',
                  height: commonHeight,
                  boxShadow: commonBoxShadow,
                  '&:hover': {
                    borderColor: '#147C65',
                    backgroundColor: 'rgba(20, 124, 101, 0.04)'
                  }
                }}
              >
                Add open ended questions
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
          </TabPanel> */}