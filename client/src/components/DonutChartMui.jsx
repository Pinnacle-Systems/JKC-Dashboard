import React from 'react';
import DXFunnel, {
    Export,
    Tooltip,
    Item,
    Label,
} from 'devextreme-react/funnel';
import './donutChartMui.css';

const formatLabel = (arg) =>
    `<span style="font-size: 16px">${arg.percentText}</span><br/><span>${arg.item.argument}</span>`;

function MyFunnel({ topSupplierLastTrurnOver }) {
    console.log(topSupplierLastTrurnOver, 'topSupplierLastTrurnOver');

    const topTurnOver = topSupplierLastTrurnOver ? topSupplierLastTrurnOver : [].map(item => ({
        argument: item.buyer,
        value: item.value
    }));

    return (
        <div className="my-funnel-wrapper" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            <DXFunnel
                id="funnel"
                dataSource={topTurnOver}
                argumentField="argument"
                valueField="value"
                height={300}
                width={300} // Set the width of the funnel
                palette={['#007bff', '#28a745', '#dc3545', '#ffc107', '#6c757d']}
            >
                <Tooltip enabled={true} format="fixedPoint" />
                <Item />
                <Label
                    visible={true}
                    position="inside"
                    backgroundColor="none"
                    customizeText={formatLabel}
                />
            </DXFunnel>
        </div>
    );
}

export default MyFunnel;
