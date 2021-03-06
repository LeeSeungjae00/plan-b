import React, { useState, useEffect } from 'react';
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Grow } from '@material-ui/core';
import { ArrowRight } from '@material-ui/icons';
import { TabPanel, a11yProps, LinkTab } from './Content/tapModule';
import ResultTable from './Content/ResultTable';
import madeAPIData from './Module/madeAPIData';
import axios from 'axios';
import Header from './Content/Header/Header'




const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "1px 1px 6px 0px",
    borderRadius: "10px"
  },
  header: {
    borderRadius: "10px 10px 0px 0px",
    background: "#565656"
  },
}));

function createData(val1, val2, val3, val4, val5, val6, val7, val8) {
  return { val1, val2, val3, val4, val5, val6, val7, val8 };
}

export default function App() {
  const [result, setResult] = useState({});
  const classes = useStyles();
  const [tabValue, setTapValue] = useState(0);
  const [tableVisible, setTableVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rangeFilter, setRangeFilter] = useState({});

  useEffect(() => {
    const getRange = async () => {
      const res = await axios.get("/limits");
      setRangeFilter(res.data);
    }
    getRange();

  }, [])




  const handleTabChange = (event, newValue) => {
    // setTableVisible(false);
    setTapValue(newValue);
  };


  const handleSend = async () => {
    try {
      console.log(result)
      const restAPIData = madeAPIData(tabValue, result);
      setLoading(true);
      if (restAPIData === 0) { setLoading(false); return; }
      const res = await axios.post("/data", restAPIData);
      console.log(res);
      rows.splice(0);

      rows.push(createData(...res.data.results));

      setRows(rows);
      setLoading(false);

      if (tableVisible === false) setTableVisible(true);
    }
    catch (e) {
      // const fakeres = { "results": [0.4, 4.4, 6.9, 9.8, 12, 13, 14.9, 14.9] }
      // rows.splice(0);
      // rows.push(createData(...fakeres.results));
      // setRows(rows);
      // if (tableVisible === false) setTableVisible(true);
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <>
      <Header title={
        <><span className = "maintitle">PLAN-B</span>
      <div className="subtitle">
            The??<span className='subtitle-PLANB P'>P</span>rediction of&nbsp;
        <span className='subtitle-PLANB L'>L</span>iver cancer using
        ??<span className='subtitle-PLANB A'>A</span>rtificial intelligence-driven model for&nbsp;
        <span className='subtitle-PLANB N'>N</span>etwork - hepatitis&nbsp;
        <span className='subtitle-PLANB B'>B</span></div></>}></Header>
      <div className="App">
        <div className="tab-rapper">
          <div className={classes.root}>
            <AppBar className={classes.header} position="static">
              <Tabs
                variant="fullWidth"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="nav tabs example"
              >
                <LinkTab label="Data from baseline (antivirals initiation)" href="/antiviralsinitiation" {...a11yProps(0)} />
                {/* <LinkTab label="Data from baseline and HBV DNA suppression (<2,000IU/ml)" href="/HBVDNAsuppression" {...a11yProps(1)} /> */}
              </Tabs>
            </AppBar>

            <TabPanel
              setResult ={setResult}
              setTableVisible={setTableVisible}
              rangeFilter={rangeFilter}
              result={result}
              loading={loading}
              onSend={handleSend}
              value={tabValue}
              index={0}>
            </TabPanel>
          </div>
        </div>
        {tableVisible &&
          <>
            <Grow timeout={1000} in={tableVisible}>
              <ArrowRight fontSize="large"></ArrowRight>
            </Grow>
            <Grow timeout={1500} in={tableVisible}>
              <div><ResultTable loading={loading} rows={rows}></ResultTable></div>
            </Grow>
          </>
        }
      </div>
    </>
  );
}