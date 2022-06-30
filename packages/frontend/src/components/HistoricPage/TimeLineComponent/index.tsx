import * as S from "./styles";
import { Chrono } from "react-chrono";
import Historic from "utils/models/historic";
import State from "utils/models/state";
import { useEffect } from "react";
import theme from "styles/theme";

type PropsProvider = {
  historic: Historic;
};


const TimeLineComponent = ({ historic }: PropsProvider) => {

  const items: any = []

  const stateSelector = (state: State) => {
    const status = []
    if (state.connection) {
      if (state.power) {
        status.push('Ligado')
        if (state.water) {
          status.push(' Molhado')
        } else {
          status.push(' Seco')
        }

        if (state.direction == 'CLOCKWISE') {
          status.push('Horário')
        } else {
          status.push('Anti-Horário')
        }

      } else {
        status.push('Desligado')
      }

    } else {
      status.push('Sem Conexão')
    }
    items.push({
      title: state.timestamp,
      cardTitle: status.toString(),
    })
  }
  useEffect(() => {
    historic.states.map((state) => {
      stateSelector(state)
    }, [])
  }, [])

  return (
    <div style={{ width: "500px", height: "400px" }}>
      <Chrono
        items={items}
        mode="VERTICAL"
        allowDynamicUpdate={true}
        cardHeight={60}
        theme={{
          primary: theme.colors.wet,
          secondary: theme.colors.secondary,
          cardBgColor: theme.colors.secondary,
          cardForeColor: theme.colors.primary,
          textColor: theme.colors.primary,
          titleColor: theme.colors.secondary,
          titleColorActive: theme.colors.primary,
        }}
        fontSizes={{
          cardSubtitle: "1rem",
          cardText: "1rem",
          cardTitle: "1.5rem",

        }}


      />
    </div>
  )
};

export default TimeLineComponent;
