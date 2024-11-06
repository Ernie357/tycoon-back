import getPoorTradeCards from '../src/gameInspectors/getPoorTradeCards';
import getBeggarTradeCards from '../src/gameInspectors/getBeggarTradeCards';

describe('getTradeCards tests', () => {

    it('should get the max of the poor', () => {
        const numberValues = ['3', '7', '4', '3', '5', '10', '10', '10', '4', '5', '12', '13'];
        const result = getPoorTradeCards(numberValues);
        expect(result).toEqual(['13']);
    });

    it('should get the max from the poor with dupes of the max', () => {
        const numberValues = ['3', '7', '4', '13', '5', '10', '13', '10', '12', '5', '12', '13'];
        const result = getPoorTradeCards(numberValues);
        expect(result).toEqual(['13']);
    });

    it('should get the maxes of the beggar', () => {
        const numberValues = ['3', '7', '4', '3', '5', '10', '10', '10', '4', '5', '12', '13'];
        const result = getBeggarTradeCards(numberValues);
        expect(result).toEqual(['13', '12']);
    });

    it('should get the maxes of the beggar with dupes', () => {
        const numberValues = ['12', '7', '4', '13', '5', '12', '13', '10', '12', '5', '12', '13'];
        const result = getBeggarTradeCards(numberValues);
        expect(result).toEqual(['13', '13']);
    });
});