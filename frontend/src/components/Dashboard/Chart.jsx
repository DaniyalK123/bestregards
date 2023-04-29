import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import _ from "lodash";

const getDaysAgo = (d) => {
  //Get today's date using the JavaScript Date object.
  var newDate = new Date();

  //Change it so that it is 7 days in the past.
  var pastDate = newDate.getDate() - d;
  newDate.setDate(pastDate);
  return newDate;
};

const getDaysArray = function (s, e) {
  for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }
  return a;
};

const groupByWeekDays = (dates) => {
  const datesObject = _.groupBy(dates, (d) => d.slice(0, 10));
  const datesByFrequency = Object.keys(datesObject).map((o) => {
    return { date: o, value: datesObject[o].length };
  });

  let weekDates = getDaysArray(getDaysAgo(7), new Date());
  weekDates = weekDates.map((m) => m.toISOString().slice(0, 10));
  weekDates.forEach((d) => {
    if (!(d in datesObject)) {
      datesByFrequency.push({ date: d, value: 0 });
    }
  });
  const sortedDatesByFrequency = datesByFrequency.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedDatesByFrequency;
};

export default function Chart({ dates }) {
  const theme = useTheme();
  const [graphDates, setGraphDates] = useState([]);

  useEffect(() => {
    console.log("SETTING GRAPH DATES", groupByWeekDays(dates));
    setGraphDates(groupByWeekDays(dates));
  }, [dates]);

  return (
    <React.Fragment>
      <Title>This Week</Title>
      <ResponsiveContainer>
        <LineChart
          data={graphDates}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis allowDecimals={false} stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Emails Sent
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
