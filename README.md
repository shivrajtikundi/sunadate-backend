user =  new customer_details({
          subscription_id:data.id,
          current_period_end:data.current_period_end,
          current_period_start:data.current_period_start,
          planName:data.plan.nickname,
          amount:data.plan.amount/100+data.plan.currency,
          active:data.plan.active,
          interval:data.plan.interval,
          latest_invoice:data.latest_invoice
        })