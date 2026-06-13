"""
HireChamps Payroll Rules Engine
Handles all salary calculation rules in a composable, versioned manner
"""

from decimal import Decimal
from datetime import date
from abc import ABC, abstractmethod
from typing import Dict, List, Tuple


class PayrollRule(ABC):
    """Base class for all payroll rules"""
    
    def __init__(self, name: str, version: int, effective_from: date):
        self.name = name
        self.version = version
        self.effective_from = effective_from
        self.configuration = {}
    
    @abstractmethod
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate the rule output based on salary data"""
        pass
    
    @abstractmethod
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        """Validate if rule can be applied"""
        pass


class IncomeTaxRule(PayrollRule):
    """
    Indian Income Tax calculation rule
    Based on current FY brackets
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Income Tax - India", version, date(2024, 4, 1))
        self.configuration = {
            'regime': 'new',  # new or old
            'brackets': [
                (300000, 0.0),
                (600000, 0.05),
                (900000, 0.10),
                (1200000, 0.15),
                (1500000, 0.20),
                (float('inf'), 0.30),
            ],
            'deductible_rate': 0.12,  # Standard deduction rate
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate income tax based on annual salary"""
        annual_salary = salary_data.get('gross_annual', Decimal('0'))
        
        if annual_salary <= 300000:
            return Decimal('0')
        
        taxable_income = annual_salary - (annual_salary * Decimal(str(self.configuration['deductible_rate'])))
        tax = Decimal('0')
        
        for i, (limit, rate) in enumerate(self.configuration['brackets'][:-1]):
            next_limit = self.configuration['brackets'][i + 1][0]
            if taxable_income > limit:
                taxable_in_bracket = min(taxable_income, next_limit) - limit
                tax += taxable_in_bracket * Decimal(str(rate))
        
        return max(tax, Decimal('0'))
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        if 'gross_annual' not in salary_data:
            return False, "gross_annual required for income tax calculation"
        return True, ""


class ProvidentFundRule(PayrollRule):
    """
    Provident Fund (PF) calculation
    Employee and Employer contribution
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Provident Fund", version, date(2024, 4, 1))
        self.configuration = {
            'employee_rate': 0.12,  # 12% of basic
            'employer_rate': 0.12,  # 12% of basic
            'wage_ceiling': Decimal('15000'),  # Monthly wage ceiling
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate employee's PF contribution"""
        basic_salary = salary_data.get('basic_salary', Decimal('0'))
        monthly_wage = min(basic_salary, self.configuration['wage_ceiling'])
        
        employee_contribution = monthly_wage * Decimal(str(self.configuration['employee_rate']))
        return employee_contribution
    
    def get_employer_contribution(self, salary_data: Dict) -> Decimal:
        """Calculate employer's PF contribution"""
        basic_salary = salary_data.get('basic_salary', Decimal('0'))
        monthly_wage = min(basic_salary, self.configuration['wage_ceiling'])
        
        employer_contribution = monthly_wage * Decimal(str(self.configuration['employer_rate']))
        return employer_contribution
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        if 'basic_salary' not in salary_data:
            return False, "basic_salary required for PF calculation"
        return True, ""


class ESIRule(PayrollRule):
    """
    Employee State Insurance (ESI) calculation
    Applicable for employees earning below wage ceiling
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Employee State Insurance", version, date(2024, 4, 1))
        self.configuration = {
            'employee_rate': 0.0075,  # 0.75% of monthly wage
            'employer_rate': 0.0325,  # 3.25% of monthly wage
            'wage_ceiling': Decimal('21000'),  # Monthly wage ceiling
            'applicable': True,
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate employee's ESI contribution"""
        if not self.configuration['applicable']:
            return Decimal('0')
        
        total_wages = salary_data.get('total_wages', Decimal('0'))
        
        if total_wages > self.configuration['wage_ceiling']:
            return Decimal('0')
        
        esi_contribution = total_wages * Decimal(str(self.configuration['employee_rate']))
        return esi_contribution
    
    def get_employer_contribution(self, salary_data: Dict) -> Decimal:
        """Calculate employer's ESI contribution"""
        if not self.configuration['applicable']:
            return Decimal('0')
        
        total_wages = salary_data.get('total_wages', Decimal('0'))
        
        if total_wages > self.configuration['wage_ceiling']:
            return Decimal('0')
        
        esi_contribution = total_wages * Decimal(str(self.configuration['employer_rate']))
        return esi_contribution
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        if 'total_wages' not in salary_data:
            return False, "total_wages required for ESI calculation"
        return True, ""


class ProfessionalTaxRule(PayrollRule):
    """
    Professional Tax calculation
    Varies by state and salary slab
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Professional Tax", version, date(2024, 4, 1))
        self.configuration = {
            'state': 'MH',  # Maharashtra default
            'slabs': {
                'MH': [  # Maharashtra
                    (150000, Decimal('0')),
                    (1000000, Decimal('200')),
                    (float('inf'), Decimal('500')),
                ],
                'KA': [  # Karnataka
                    (300000, Decimal('0')),
                    (1000000, Decimal('150')),
                    (float('inf'), Decimal('300')),
                ],
                'default': [
                    (float('inf'), Decimal('0')),
                ],
            }
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate professional tax"""
        annual_salary = salary_data.get('gross_annual', Decimal('0'))
        state = salary_data.get('state', self.configuration['state'])
        
        slabs = self.configuration['slabs'].get(state, self.configuration['slabs']['default'])
        
        for limit, tax_amount in slabs:
            if annual_salary < limit:
                return tax_amount / 12  # Monthly tax
        
        return slabs[-1][1] / 12
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        if 'gross_annual' not in salary_data:
            return False, "gross_annual required for professional tax calculation"
        return True, ""


class BonusRule(PayrollRule):
    """
    Annual Bonus calculation
    Based on salary and performance
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Annual Bonus", version, date(2024, 4, 1))
        self.configuration = {
            'calculation_method': 'percentage',  # percentage or fixed
            'percentage': Decimal('0.833'),  # ~10 days per month as per Gratuity Act
            'applicable_after_months': 6,
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate annual bonus"""
        months_worked = salary_data.get('months_worked', 0)
        
        if months_worked < self.configuration['applicable_after_months']:
            return Decimal('0')
        
        if self.configuration['calculation_method'] == 'percentage':
            annual_basic = salary_data.get('basic_annual', Decimal('0'))
            bonus = annual_basic * self.configuration['percentage']
            return bonus
        
        return Decimal('0')
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        if 'basic_annual' not in salary_data or 'months_worked' not in salary_data:
            return False, "basic_annual and months_worked required for bonus calculation"
        return True, ""


class GratuityRule(PayrollRule):
    """
    Gratuity calculation
    Based on Indian Gratuity Act
    """
    
    def __init__(self, version: int = 1):
        super().__init__("Gratuity", version, date(2024, 4, 1))
        self.configuration = {
            'applicable_after_years': 5,
            'calculation_method': 'indian_act',  # Based on Gratuity Act
            'max_amount': Decimal('2000000'),  # Max gratuity limit
        }
    
    def calculate(self, salary_data: Dict) -> Decimal:
        """Calculate gratuity on separation"""
        years_of_service = salary_data.get('years_of_service', 0)
        
        if years_of_service < self.configuration['applicable_after_years']:
            return Decimal('0')
        
        # Gratuity = (Basic + DA) × Number of years of service / 26
        basic_salary = salary_data.get('basic_salary', Decimal('0'))
        da = salary_data.get('dearness_allowance', Decimal('0'))
        
        gratuity = (basic_salary + da) * Decimal(str(years_of_service)) / 26
        
        return min(gratuity, self.configuration['max_amount'])
    
    def validate(self, salary_data: Dict) -> Tuple[bool, str]:
        required_fields = ['basic_salary', 'dearness_allowance', 'years_of_service']
        missing = [f for f in required_fields if f not in salary_data]
        if missing:
            return False, f"Missing fields for gratuity: {', '.join(missing)}"
        return True, ""


class PayrollCalculator:
    """
    Composite payroll calculator
    Applies multiple rules in sequence
    """
    
    def __init__(self):
        self.rules: Dict[str, PayrollRule] = {}
        self.rule_order = []
    
    def register_rule(self, rule: PayrollRule, order: int = None):
        """Register a payroll rule"""
        self.rules[rule.name] = rule
        if order is not None:
            self.rule_order.insert(order, rule.name)
        else:
            self.rule_order.append(rule.name)
    
    def calculate_salary(self, employee_salary_data: Dict) -> Dict:
        """
        Calculate complete salary with all applicable rules
        
        Input salary_data should contain:
        - basic_salary: Monthly basic salary
        - dearness_allowance: DA amount
        - house_rent_allowance: HRA amount
        - gross_annual: Annual gross salary
        - months_worked: Months worked in financial year
        - years_of_service: Total years employed
        - state: State for PT calculation
        """
        
        results = {
            'earnings': {},
            'deductions': {},
            'gross_salary': Decimal('0'),
            'net_salary': Decimal('0'),
            'errors': []
        }
        
        # Calculate earnings
        for field in ['basic_salary', 'dearness_allowance', 'house_rent_allowance']:
            if field in employee_salary_data:
                results['earnings'][field] = employee_salary_data[field]
        
        results['gross_salary'] = sum(results['earnings'].values())
        
        # Apply deduction rules
        for rule_name in self.rule_order:
            if rule_name not in self.rules:
                continue
            
            rule = self.rules[rule_name]
            is_valid, error_msg = rule.validate(employee_salary_data)
            
            if not is_valid:
                results['errors'].append(f"{rule_name}: {error_msg}")
                continue
            
            try:
                deduction = rule.calculate(employee_salary_data)
                if deduction > 0:
                    results['deductions'][rule_name] = deduction
            except Exception as e:
                results['errors'].append(f"{rule_name}: {str(e)}")
        
        # Calculate net salary
        total_deductions = sum(results['deductions'].values())
        results['net_salary'] = results['gross_salary'] - total_deductions
        
        return results


# Initialize default payroll calculator instance
default_calculator = PayrollCalculator()
default_calculator.register_rule(IncomeTaxRule(), 0)
default_calculator.register_rule(ProvidentFundRule(), 1)
default_calculator.register_rule(ESIRule(), 2)
default_calculator.register_rule(ProfessionalTaxRule(), 3)
