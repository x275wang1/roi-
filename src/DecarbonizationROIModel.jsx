import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Calculator, TrendingUp, DollarSign, Zap, BarChart3, Activity, AlertTriangle, Target, Settings, Filter } from 'lucide-react';

const DecarbonizationROIModel = () => {
  const COLORS = {
    primary: '#35704A',
    secondary: '#85A982',
    tertiary: '#8FA18E',
    light: '#C7D5C3',
    extraLight: '#f7fcf5',
    greenLight: '#c7e9c0',
    greenMid: '#74c476',
    greenDark: '#238b45',
    greenDarkest: '#00441b',
    // Power BI 风格的背景色
    bgDark: '#1e1e1e',
    bgCard: '#2d2d2d',
    bgCardHover: '#3a3a3a',
    borderColor: '#404040',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3'
  };
  
  const [totalInvestment, setTotalInvestment] = useState(12000);
  const [investmentPeriod, setInvestmentPeriod] = useState(3);
  const [discountRate, setDiscountRate] = useState(8);
  const [avgEnergySaving, setAvgEnergySaving] = useState(10);
  const [totalEnergyCost, setTotalEnergyCost] = useState(50000);
  const [greenFundSize, setGreenFundSize] = useState(5000);
  const [fundReturnRate, setFundReturnRate] = useState(8);
  const [euCarbonTaxRisk, setEuCarbonTaxRisk] = useState(3000);
  const [taxAvoidanceRate, setTaxAvoidanceRate] = useState(70);
  const [annualRevenue, setAnnualRevenue] = useState(100000);
  const [riskReductionRate, setRiskReductionRate] = useState(30);
  const [operationEfficiency, setOperationEfficiency] = useState(1000);
  const [euRevenue, setEuRevenue] = useState(30000);
  const [greenProductRatio, setGreenProductRatio] = useState(30);
  const [greenPremium, setGreenPremium] = useState(4);
  const [marketingBudget, setMarketingBudget] = useState(20000);
  const [marketingSaving, setMarketingSaving] = useState(5);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRateReduction, setInterestRateReduction] = useState(0.3);
  const [showSidebar, setShowSidebar] = useState(true);

  const calculations = useMemo(() => {
    const annualCost = totalInvestment / investmentPeriod;
    const energySavings = totalEnergyCost * (avgEnergySaving / 100);
    const fundReturns = greenFundSize * (fundReturnRate / 100);
    const costBenefits = energySavings + fundReturns;
    
    const carbonTaxAvoidance = euCarbonTaxRisk * (taxAvoidanceRate / 100);
    const riskMitigation = annualRevenue * 0.01 * (riskReductionRate / 100);
    const supplyBenefits = carbonTaxAvoidance + riskMitigation + operationEfficiency;
    
    const greenPremiumRevenue = euRevenue * (greenProductRatio / 100) * (greenPremium / 100);
    const marketingSavings = marketingBudget * (marketingSaving / 100);
    const financingCostReduction = loanAmount * (interestRateReduction / 100);
    const brandBenefits = greenPremiumRevenue + marketingSavings + financingCostReduction;
    
    const totalAnnualBenefits = costBenefits + supplyBenefits + brandBenefits;
    const netBenefit = totalAnnualBenefits - annualCost;
    const roi = (netBenefit / annualCost) * 100;
    const paybackPeriod = totalInvestment / totalAnnualBenefits;
    
    let npv = -totalInvestment;
    const cashFlows = [-totalInvestment];
    
    for (let year = 1; year <= 5; year++) {
      const growthFactor = year <= 2 ? 0.7 + (year - 1) * 0.15 : 1;
      const yearBenefit = totalAnnualBenefits * growthFactor;
      const yearCost = year <= investmentPeriod ? -(totalInvestment / investmentPeriod) : 0;
      const netCashFlow = yearBenefit + yearCost;
      npv += netCashFlow / Math.pow(1 + discountRate/100, year);
      cashFlows.push(netCashFlow);
    }
    
    let irr = 0.1;
    for (let i = 0; i < 20; i++) {
      let npvAtRate = 0;
      let derivativeAtRate = 0;
      cashFlows.forEach((cf, t) => {
        npvAtRate += cf / Math.pow(1 + irr, t);
        derivativeAtRate -= t * cf / Math.pow(1 + irr, t + 1);
      });
      if (Math.abs(npvAtRate) < 0.01) break;
      irr = irr - npvAtRate / derivativeAtRate;
    }
    
    const yearlyData = [];
    let cumulativeCashFlow = -totalInvestment;
    let cumulativeNPV = -totalInvestment;
    
    for (let year = 1; year <= 5; year++) {
      const growthFactor = year <= 2 ? 0.7 + (year - 1) * 0.15 : 1;
      const yearBenefit = totalAnnualBenefits * growthFactor;
      const yearCost = year <= investmentPeriod ? -(totalInvestment / investmentPeriod) : 0;
      const netCash = yearBenefit + yearCost;
      cumulativeCashFlow += netCash;
      const discountedCashFlow = netCash / Math.pow(1 + discountRate/100, year);
      cumulativeNPV += discountedCashFlow;
      
      yearlyData.push({
        year: `Y${year}`,
        投资额: Math.abs(yearCost),
        成本端收益: costBenefits * growthFactor,
        供应端收益: supplyBenefits * growthFactor,
        品牌端收益: brandBenefits * growthFactor,
        净现金流: netCash,
        累计现金流: cumulativeCashFlow,
        折现现金流: discountedCashFlow,
        累计NPV: cumulativeNPV
      });
    }
    
    let cumulative = -annualCost;
    const waterfallData = [
      { name: '年化投资', value: -annualCost, cumulative: -annualCost, type: 'negative' },
      { name: '节能收益', value: energySavings, cumulative: cumulative + energySavings, type: 'positive' }
    ];
    cumulative += energySavings;
    
    waterfallData.push({ name: '基金收益', value: fundReturns, cumulative: cumulative + fundReturns, type: 'positive' });
    cumulative += fundReturns;
    waterfallData.push({ name: '规避碳税', value: carbonTaxAvoidance, cumulative: cumulative + carbonTaxAvoidance, type: 'positive' });
    cumulative += carbonTaxAvoidance;
    waterfallData.push({ name: '风险降低', value: riskMitigation, cumulative: cumulative + riskMitigation, type: 'positive' });
    cumulative += riskMitigation;
    waterfallData.push({ name: '效率提升', value: operationEfficiency, cumulative: cumulative + operationEfficiency, type: 'positive' });
    cumulative += operationEfficiency;
    waterfallData.push({ name: '绿色溢价', value: greenPremiumRevenue, cumulative: cumulative + greenPremiumRevenue, type: 'positive' });
    cumulative += greenPremiumRevenue;
    waterfallData.push({ name: '营销节省', value: marketingSavings, cumulative: cumulative + marketingSavings, type: 'positive' });
    cumulative += marketingSavings;
    waterfallData.push({ name: '融资优惠', value: financingCostReduction, cumulative: cumulative + financingCostReduction, type: 'positive' });
    cumulative += financingCostReduction;
    waterfallData.push({ name: '年度净利', value: netBenefit, cumulative: netBenefit, type: 'total' });
    
    const baseROI = roi;
    const sensitivityData = [
      {
        param: '节能率',
        negative: ((totalEnergyCost * 0.05 + fundReturns + supplyBenefits + brandBenefits - annualCost) / annualCost * 100) - baseROI,
        positive: ((totalEnergyCost * 0.15 + fundReturns + supplyBenefits + brandBenefits - annualCost) / annualCost * 100) - baseROI
      },
      {
        param: '绿色溢价',
        negative: ((costBenefits + supplyBenefits + euRevenue * (greenProductRatio/100) * 0.02 + marketingSavings + financingCostReduction - annualCost) / annualCost * 100) - baseROI,
        positive: ((costBenefits + supplyBenefits + euRevenue * (greenProductRatio/100) * 0.06 + marketingSavings + financingCostReduction - annualCost) / annualCost * 100) - baseROI
      },
      {
        param: '风险降低率',
        negative: ((costBenefits + carbonTaxAvoidance + annualRevenue * 0.01 * 0.15 + operationEfficiency + brandBenefits - annualCost) / annualCost * 100) - baseROI,
        positive: ((costBenefits + carbonTaxAvoidance + annualRevenue * 0.01 * 0.45 + operationEfficiency + brandBenefits - annualCost) / annualCost * 100) - baseROI
      },
      {
        param: '折现率',
        negative: 0,
        positive: 0
      }
    ];
    
    const benefitBreakdown = [
      { name: '成本端收益', value: costBenefits, color: COLORS.primary },
      { name: '供应端收益', value: supplyBenefits, color: COLORS.secondary },
      { name: '品牌端收益', value: brandBenefits, color: COLORS.tertiary }
    ];
    
    const riskMatrix = [
      { name: 'EU碳税风险', probability: 75, impact: euCarbonTaxRisk/10000, value: euCarbonTaxRisk * 0.75 },
      { name: '供应链中断', probability: 40, impact: annualRevenue * 0.005, value: annualRevenue * 0.002 },
      { name: '绿色溢价失效', probability: 25, impact: greenPremiumRevenue/10000, value: greenPremiumRevenue * 0.25 },
      { name: '政策变动', probability: 60, impact: totalAnnualBenefits * 0.2/10000, value: totalAnnualBenefits * 0.12 }
    ];
    
    const competitiveAdvantage = [
      { dimension: '成本优势', value: Math.min(95, 50 + avgEnergySaving * 3) },
      { dimension: '供应链韧性', value: Math.min(90, 40 + riskReductionRate * 1.5) },
      { dimension: '品牌价值', value: Math.min(85, 30 + greenProductRatio * 1.8) },
      { dimension: '融资能力', value: Math.min(80, 50 + interestRateReduction * 80) },
      { dimension: '运营效率', value: Math.min(88, 60 + (operationEfficiency/50)) },
      { dimension: '市场定位', value: Math.min(92, 45 + greenPremium * 8) }
    ];
    
    return {
      annualCost,
      energySavings,
      fundReturns,
      costBenefits,
      carbonTaxAvoidance,
      riskMitigation,
      supplyBenefits,
      greenPremiumRevenue,
      marketingSavings,
      financingCostReduction,
      brandBenefits,
      totalAnnualBenefits,
      netBenefit,
      roi,
      paybackPeriod,
      npv,
      irr,
      yearlyData,
      waterfallData,
      sensitivityData,
      benefitBreakdown,
      riskMatrix,
      competitiveAdvantage
    };
  }, [totalInvestment, investmentPeriod, discountRate, avgEnergySaving, totalEnergyCost, 
      greenFundSize, fundReturnRate, euCarbonTaxRisk, taxAvoidanceRate, annualRevenue, 
      riskReductionRate, operationEfficiency, euRevenue, greenProductRatio, greenPremium, 
      marketingBudget, marketingSaving, loanAmount, interestRateReduction]);

  const InputField = ({ label, value, onChange, unit, min, max, step = 1, icon: Icon }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '12px', 
        fontWeight: 500, 
        marginBottom: '8px',
        color: COLORS.textSecondary 
      }}>
        {Icon && <Icon size={14} />}
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: COLORS.bgDark,
            color: COLORS.textPrimary,
            border: `1px solid ${COLORS.borderColor}`,
            outline: 'none'
          }}
        />
        {unit && <span style={{ fontSize: '12px', whiteSpace: 'nowrap', color: COLORS.textSecondary }}>{unit}</span>}
      </div>
    </div>
  );

  const MetricCard = ({ title, value, unit, icon: Icon, trend, subtitle }) => (
    <div style={{
      backgroundColor: COLORS.bgCard,
      borderColor: COLORS.borderColor,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '8px',
      padding: '16px',
      transition: 'all 0.3s'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && <Icon size={18} color={COLORS.primary} />}
          <span style={{ fontSize: '12px', fontWeight: 500, color: COLORS.textSecondary }}>{title}</span>
        </div>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: COLORS.primary,
            color: 'white'
          }}>
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: COLORS.textPrimary }}>
        {value}
        {unit && <span style={{ fontSize: '16px', marginLeft: '4px', color: COLORS.textSecondary }}>{unit}</span>}
      </div>
      {subtitle && <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>{subtitle}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bgDark }}>
      {/* 顶部导航栏 */}
      <div style={{
        backgroundColor: COLORS.bgCard,
        borderBottom: `1px solid ${COLORS.borderColor}`
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 size={20} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textPrimary, margin: 0 }}>
                  脱碳投资 ROI 决策模型
                </h1>
                <p style={{ fontSize: '12px', color: COLORS.textSecondary, margin: 0 }}>
                  Decarbonization Investment Dashboard
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: COLORS.bgDark,
              color: COLORS.textPrimary,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Filter size={16} />
            <span style={{ fontSize: '14px' }}>{showSidebar ? '隐藏' : '显示'}参数</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* 侧边栏 - 参数输入 */}
        {showSidebar && (
          <div style={{
            width: '320px',
            backgroundColor: COLORS.bgCard,
            borderRight: `1px solid ${COLORS.borderColor}`,
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: `1px solid ${COLORS.borderColor}`
              }}>
                <Settings size={18} color={COLORS.primary} />
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textPrimary, margin: 0 }}>
                  模型参数设置
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 投资参数 */}
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${COLORS.borderColor}`,
                    color: COLORS.primary
                  }}>
                    💰 投资参数
                  </h3>
                  <InputField
                    label="总投资额"
                    value={totalInvestment}
                    onChange={setTotalInvestment}
                    unit="万元"
                    min={0}
                    icon={DollarSign}
                  />
                  <InputField
                    label="投资期限"
                    value={investmentPeriod}
                    onChange={setInvestmentPeriod}
                    unit="年"
                    min={1}
                    max={10}
                  />
                  <InputField
                    label="折现率"
                    value={discountRate}
                    onChange={setDiscountRate}
                    unit="%"
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>

                {/* 成本端参数 */}
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${COLORS.borderColor}`,
                    color: COLORS.primary
                  }}>
                    ⚡ 成本端收益
                  </h3>
                  <InputField
                    label="平均节能率"
                    value={avgEnergySaving}
                    onChange={setAvgEnergySaving}
                    unit="%"
                    min={0}
                    max={50}
                    icon={Zap}
                  />
                  <InputField
                    label="年度能源成本"
                    value={totalEnergyCost}
                    onChange={setTotalEnergyCost}
                    unit="万元"
                    min={0}
                  />
                  <InputField
                    label="绿色基金规模"
                    value={greenFundSize}
                    onChange={setGreenFundSize}
                    unit="万元"
                    min={0}
                  />
                  <InputField
                    label="基金回报率"
                    value={fundReturnRate}
                    onChange={setFundReturnRate}
                    unit="%"
                    min={0}
                    max={30}
                    step={0.5}
                  />
                </div>

                {/* 供应端参数 */}
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${COLORS.borderColor}`,
                    color: COLORS.primary
                  }}>
                    🔗 供应链收益
                  </h3>
                  <InputField
                    label="EU碳税风险"
                    value={euCarbonTaxRisk}
                    onChange={setEuCarbonTaxRisk}
                    unit="万元"
                    min={0}
                    icon={AlertTriangle}
                  />
                  <InputField
                    label="规避率"
                    value={taxAvoidanceRate}
                    onChange={setTaxAvoidanceRate}
                    unit="%"
                    min={0}
                    max={100}
                  />
                  <InputField
                    label="年营收"
                    value={annualRevenue}
                    onChange={setAnnualRevenue}
                    unit="万元"
                    min={0}
                  />
                  <InputField
                    label="风险降低率"
                    value={riskReductionRate}
                    onChange={setRiskReductionRate}
                    unit="%"
                    min={0}
                    max={100}
                  />
                  <InputField
                    label="运营效率提升"
                    value={operationEfficiency}
                    onChange={setOperationEfficiency}
                    unit="万元"
                    min={0}
                  />
                </div>

                {/* 品牌端参数 */}
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${COLORS.borderColor}`,
                    color: COLORS.primary
                  }}>
                    🌟 品牌价值收益
                  </h3>
                  <InputField
                    label="EU市场营收"
                    value={euRevenue}
                    onChange={setEuRevenue}
                    unit="万元"
                    min={0}
                    icon={Target}
                  />
                  <InputField
                    label="绿色产品占比"
                    value={greenProductRatio}
                    onChange={setGreenProductRatio}
                    unit="%"
                    min={0}
                    max={100}
                  />
                  <InputField
                    label="绿色溢价率"
                    value={greenPremium}
                    onChange={setGreenPremium}
                    unit="%"
                    min={0}
                    max={20}
                    step={0.5}
                  />
                  <InputField
                    label="营销预算"
                    value={marketingBudget}
                    onChange={setMarketingBudget}
                    unit="万元"
                    min={0}
                  />
                  <InputField
                    label="营销节省率"
                    value={marketingSaving}
                    onChange={setMarketingSaving}
                    unit="%"
                    min={0}
                    max={50}
                  />
                  <InputField
                    label="贷款额度"
                    value={loanAmount}
                    onChange={setLoanAmount}
                    unit="万元"
                    min={0}
                  />
                  <InputField
                    label="利率优惠"
                    value={interestRateReduction}
                    onChange={setInterestRateReduction}
                    unit="%"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 主内容区 */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '24px', 
          maxHeight: 'calc(100vh - 64px)' 
        }}>
          {/* 关键指标卡片 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <MetricCard
              title="年化ROI"
              value={calculations.roi.toFixed(1)}
              unit="%"
              icon={TrendingUp}
              trend="+优秀"
              subtitle="投资回报率"
            />
            <MetricCard
              title="回本周期"
              value={calculations.paybackPeriod.toFixed(2)}
              unit="年"
              icon={Calculator}
              subtitle="投资回收期"
            />
            <MetricCard
              title="年度净收益"
              value={(calculations.netBenefit/10000).toFixed(2)}
              unit="亿元"
              icon={DollarSign}
              subtitle="扣除年化成本后"
            />
            <MetricCard
              title="总年度收益"
              value={(calculations.totalAnnualBenefits/10000).toFixed(2)}
              unit="亿元"
              icon={Activity}
              subtitle="三端收益合计"
            />
          </div>

          {/* 收益结构分析 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: COLORS.textPrimary 
              }}>
                收益结构占比分析
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={calculations.benefitBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculations.benefitBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(0)} 万元`}
                    contentStyle={{
                      backgroundColor: COLORS.bgDark,
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      color: COLORS.textPrimary
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: COLORS.textPrimary 
              }}>
                五年累计现金流趋势
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={calculations.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
                  <XAxis dataKey="year" stroke={COLORS.textSecondary} />
                  <YAxis stroke={COLORS.textSecondary} />
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(0)} 万元`}
                    contentStyle={{
                      backgroundColor: COLORS.bgDark,
                      border: `1px solid ${COLORS.borderColor}`,
                      borderRadius: '8px',
                      color: COLORS.textPrimary
                    }}
                  />
                  <Legend wrapperStyle={{color: COLORS.textPrimary}} />
                  <Area type="monotone" dataKey="累计现金流" fill={COLORS.secondary} fillOpacity={0.3} 
                        stroke={COLORS.secondary} strokeWidth={2} />
                  <Line type="monotone" dataKey="净现金流" stroke={COLORS.primary} strokeWidth={3} 
                        dot={{r: 5, fill: COLORS.primary}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 收益瀑布图 */}
          <div style={{
            backgroundColor: COLORS.bgCard,
            borderColor: COLORS.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: COLORS.textPrimary 
            }}>
              年度收益瀑布分析图
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={calculations.waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} 
                       stroke={COLORS.textSecondary} tick={{fontSize: 11}} />
                <YAxis stroke={COLORS.textSecondary} />
                <Tooltip 
                  formatter={(value) => `${Math.abs(value).toFixed(0)} 万元`}
                  contentStyle={{
                    backgroundColor: COLORS.bgDark,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '8px',
                    color: COLORS.textPrimary
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {calculations.waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} 
                          fill={entry.type === 'negative' ? COLORS.greenDarkest : 
                                entry.type === 'total' ? COLORS.primary : COLORS.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 分项收益明细 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: COLORS.primary 
              }}>
                <Zap size={14} />
                成本端收益明细
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>节能收益</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.energySavings.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>基金收益</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.fundReturns.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 0 8px 0',
                  borderTop: `2px solid ${COLORS.primary}` 
                }}>
                  <span style={{ fontWeight: 'bold', color: COLORS.textPrimary }}>小计</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: COLORS.primary }}>
                    {calculations.costBenefits.toFixed(0)} 万元
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: COLORS.secondary 
              }}>
                <AlertTriangle size={14} />
                供应端收益明细
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>规避碳税</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.carbonTaxAvoidance.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>风险降低</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.riskMitigation.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>效率提升</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.operationEfficiency.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 0 8px 0',
                  borderTop: `2px solid ${COLORS.secondary}` 
                }}>
                  <span style={{ fontWeight: 'bold', color: COLORS.textPrimary }}>小计</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: COLORS.secondary }}>
                    {calculations.supplyBenefits.toFixed(0)} 万元
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: COLORS.tertiary 
              }}>
                <Target size={14} />
                品牌端收益明细
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>绿色溢价</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.greenPremiumRevenue.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>营销节省</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.marketingSavings.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: `1px solid ${COLORS.borderColor}` 
                }}>
                  <span style={{color: COLORS.textSecondary}}>融资优惠</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {calculations.financingCostReduction.toFixed(0)} 万元
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 0 8px 0',
                  borderTop: `2px solid ${COLORS.tertiary}` 
                }}>
                  <span style={{ fontWeight: 'bold', color: COLORS.textPrimary }}>小计</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', color: COLORS.tertiary }}>
                    {calculations.brandBenefits.toFixed(0)} 万元
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 敏感性分析 */}
          <div style={{
            backgroundColor: COLORS.bgCard,
            borderColor: COLORS.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: COLORS.textPrimary 
            }}>
              关键参数敏感性分析 (ROI变化)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calculations.sensitivityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
                <XAxis type="number" stroke={COLORS.textSecondary} 
                       label={{value: 'ROI 变化 (%)', position: 'insideBottom', offset: -5, 
                               fill: COLORS.textSecondary}} />
                <YAxis dataKey="param" type="category" stroke={COLORS.textSecondary} width={80} />
                <Tooltip 
                  formatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: COLORS.bgDark,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '8px',
                    color: COLORS.textPrimary
                  }}
                />
                <Legend wrapperStyle={{color: COLORS.textPrimary}} />
                <Bar dataKey="negative" fill={COLORS.greenDarkest} name="下降50%" radius={[0, 4, 4, 0]} />
                <Bar dataKey="positive" fill={COLORS.primary} name="上升50%" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 风险矩阵和雷达图 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: COLORS.textPrimary 
              }}>
                风险-收益矩阵分析
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <CartesianGrid stroke={COLORS.borderColor} />
                  <XAxis type="number" dataKey="probability" name="发生概率" unit="%" domain={[0, 100]}
                         stroke={COLORS.textSecondary}
                         label={{value: '发生概率 (%)', position: 'insideBottom', offset: -10, 
                                 fill: COLORS.textSecondary}} />
                  <YAxis type="number" dataKey="impact" name="财务影响" stroke={COLORS.textSecondary}
                         label={{value: '财务影响 (千万元)', angle: -90, position: 'insideLeft', 
                                 fill: COLORS.textSecondary}} />
                  <ZAxis type="number" dataKey="value" range={[100, 1000]} />
                  <Tooltip cursor={{strokeDasharray: '3 3'}}
                           content={({active, payload}) => {
                             if (active && payload && payload.length) {
                               const data = payload[0].payload;
                               return (
                                 <div style={{
                                   padding: '12px',
                                   borderRadius: '8px',
                                   backgroundColor: COLORS.bgDark,
                                   border: `1px solid ${COLORS.secondary}`
                                 }}>
                                   <p style={{ fontWeight: 'bold', color: COLORS.primary, margin: '0 0 4px 0' }}>{data.name}</p>
                                   <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '2px 0' }}>
                                     发生概率: {data.probability}%
                                   </p>
                                   <p style={{ fontSize: '14px', color: COLORS.textSecondary, margin: '2px 0' }}>
                                     财务影响: {data.value.toFixed(0)}万元
                                   </p>
                                 </div>
                               );
                             }
                             return null;
                           }} />
                  <Scatter data={calculations.riskMatrix} fill={COLORS.primary}>
                    {calculations.riskMatrix.map((entry, index) => (
                      <Cell key={`cell-${index}`} 
                            fill={[COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.greenMid][index % 4]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              backgroundColor: COLORS.bgCard,
              borderColor: COLORS.borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: COLORS.textPrimary 
              }}>
                战略竞争优势评估
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={calculations.competitiveAdvantage}>
                  <PolarGrid stroke={COLORS.borderColor} />
                  <PolarAngleAxis dataKey="dimension" tick={{fontSize: 11, fill: COLORS.textSecondary}} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fontSize: 10, fill: COLORS.textSecondary}} />
                  <Radar name="当前水平" dataKey="value" stroke={COLORS.primary} fill={COLORS.secondary} 
                         fillOpacity={0.6} strokeWidth={2} />
                  <Tooltip formatter={(value) => `${value.toFixed(0)}/100`}
                           contentStyle={{
                             backgroundColor: COLORS.bgDark,
                             border: `1px solid ${COLORS.borderColor}`,
                             borderRadius: '8px',
                             color: COLORS.textPrimary
                           }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NPV分析 */}
          <div style={{
            backgroundColor: COLORS.bgCard,
            borderColor: COLORS.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: COLORS.textPrimary 
            }}>
              净现值(NPV)分析:五年折现现金流
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={calculations.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
                <XAxis dataKey="year" stroke={COLORS.textSecondary} />
                <YAxis stroke={COLORS.textSecondary} />
                <Tooltip 
                  formatter={(value) => `${value.toFixed(0)} 万元`}
                  contentStyle={{
                    backgroundColor: COLORS.bgDark,
                    border: `1px solid ${COLORS.borderColor}`,
                    borderRadius: '8px',
                    color: COLORS.textPrimary
                  }}
                />
                <Legend wrapperStyle={{color: COLORS.textPrimary}} />
                <Bar dataKey="净现金流" fill={COLORS.secondary} fillOpacity={0.8} radius={[8, 8, 0, 0]} />
                <Bar dataKey="折现现金流" fill={COLORS.tertiary} radius={[8, 8, 0, 0]} />
                <Line type="monotone" dataKey="累计NPV" stroke={COLORS.primary} strokeWidth={3} 
                      dot={{r: 5, fill: COLORS.primary}} />
              </ComposedChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: COLORS.bgDark,
                border: `1px solid ${COLORS.borderColor}`
              }}>
                <div style={{ fontSize: '12px', marginBottom: '4px', color: COLORS.textSecondary }}>五年累计NPV</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.primary }}>
                  {(calculations.npv/10000).toFixed(2)} 亿元
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: COLORS.textSecondary }}>
                  折现率: {discountRate}%
                </div>
              </div>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: COLORS.bgDark,
                border: `1px solid ${COLORS.borderColor}`
              }}>
                <div style={{ fontSize: '12px', marginBottom: '4px', color: COLORS.textSecondary }}>内部收益率(IRR)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.primary }}>
                  {calculations.irr.toFixed(1)}%
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: COLORS.textSecondary }}>
                  远超WACC要求水平
                </div>
              </div>
            </div>
          </div>

          {/* 详细数据表 */}
          <div style={{
            backgroundColor: COLORS.bgCard,
            borderColor: COLORS.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: COLORS.textPrimary 
            }}>
              五年期详细财务预测明细表
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{backgroundColor: COLORS.bgDark}}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>年份</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>投资额</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>成本端</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>供应端</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>品牌端</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>净现金流</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>累计现金流</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: COLORS.primary }}>累计NPV</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.yearlyData.map((row, index) => (
                    <tr key={index} style={{
                      borderBottom: `1px solid ${COLORS.borderColor}`,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.bgCardHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: COLORS.textPrimary }}>{row.year}</td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', color: COLORS.greenDarkest }}>
                        -{row.投资额.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', color: COLORS.primary }}>
                        {row.成本端收益.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', color: COLORS.secondary }}>
                        {row.供应端收益.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', color: COLORS.tertiary }}>
                        {row.品牌端收益.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, 
                                   color: row.净现金流 >= 0 ? COLORS.primary : COLORS.greenDarkest }}>
                        {row.净现金流.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, 
                                   color: row.累计现金流 >= 0 ? COLORS.primary : COLORS.greenDarkest }}>
                        {row.累计现金流.toFixed(0)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, 
                                   color: row.累计NPV >= 0 ? COLORS.primary : COLORS.greenDarkest }}>
                        {row.累计NPV.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecarbonizationROIModel;